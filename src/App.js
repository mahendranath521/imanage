import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [int, setInt] = useState();
  const [size, setSize] = useState(1);
  const [stack, setStack] = useState([]);
  const [error, setError] = useState({
    isSizeMandatory: false,
    isSizevalid: false,
    isIntegerRequired: false,
    isArraySizeValid: false,
    isArrayEmpty: false,
    isErrormsg: ''
  })
  useEffect(() => {
    getData();
    getSize();
  }, [])

  const getSize = () => {
    axios.get('http://localhost:8000/api/v1/stack').then((res) => {
      if (res && res.data) {
        setSize(res.data.size)
      }
    }).catch(err => {
    
    })
  }
  const getData = () => {
    axios.get('http://localhost:8000/api/v1/stack/getData').then((res) => {
      if (res && res.data) {
        setStack(res.data)
      }
    }).catch(err => {
      if (err.response && err.response.data) {
        setError({ ...error, isArraySizeValid: true, isErrormsg: err.response.data.msg });
      }
    })
  }
  const handleInput = (e) => {
    setInt(e.target.value)
  }

  const handleStackSize = (e) => {
    setSize(e.target.value)
  }
  const handlePush = () => {
    if (!int && !error.isIntegerRequired) {
      setError({ ...error, isIntegerRequired: true, isArrayEmpty: false })
    } else {
      setError({ ...error, isIntegerRequired: false, isArrayEmpty: false })
      const body = [];
      body.push(parseInt(int));
      axios.post('http://localhost:8000/api/v1/stack/pushData/' + size, body).then(res => {
        if (res && res.data) {
          setStack(res.data);
          setInt('');
        }
      }).catch(err => {
        if (err.response && err.response.data) {
          setInt('');
          setError({ ...error, isArraySizeValid: true,isArrayEmpty: false, isErrormsg: err.response.data.msg });
        }
      })
    }
  }


  const handlePop = () => {
    setError({ ...error, isArrayEmpty: false, isArraySizeValid: false});
    axios.post('http://localhost:8000/api/v1/stack/popData', []).then(res => {
      if (res && res.data) {
        setStack(res.data)
      }
    }).catch(err => {
      if (err.response && err.response.data) {
        setError({ ...error, isArrayEmpty: true,isArraySizeValid:false, isErrormsg: err.response.data.msg });
      }
    })
  }

  const clickStackSize = () => {
    const regExp = /^\d+$/;
    if (!size) {
      setError({ ...error, isSizeMandatory: true })
    } else if (!regExp.test(size)) {
      setError({ ...error, isSizevalid: true, isSizeMandatory: false })
    } else {
      const body = { size }
      axios.post('http://localhost:8000/api/v1/stack', body).then(res => {
        console.log("ress", res.data.size)
      }).catch(err => {
        console.log("errr", err)
      })
    }
  }
  return (
    <div className="App">
      <div style={{ marginTop: '12px' }}>
        <label>Stack Size : </label>
        <input type="text" name="Size" value={size} onChange={handleStackSize} />
        <button onClick={clickStackSize} className='button-class'>Set Stack Size</button>
        {
          error.isSizeMandatory && <p style={{ color: 'red' }}>Please enter details</p>
        }
        {
          error.isSizevalid && <p style={{ color: 'red' }}>Please enter only numbers</p>
        }
      </div>
      <div style={{ marginTop: '12px' }}>
        <label>Integer : </label>
        <input type="text" name="Integer" value={int} onChange={handleInput} />
        <button onClick={handlePush} className="button-class">Push</button>
        <button onClick={handlePop} className='button-class'>Pop</button>
        {
          error.isIntegerRequired && <p style={{ color: 'red' }}>Please enter value to push</p>
        }
      </div>
      <div>
        <h3>Display Integers</h3>
        {
          stack && stack.length > 0 && stack.map((value, i) => {
            return (<li key={i}>{value}</li>)
          })
        }
        {
          error.isArraySizeValid && <p style={{ color: 'red' }}>{error.isErrormsg}</p>
        }
        {
          error.isArrayEmpty && <p style={{ color: 'red' }}>{error.isErrormsg}</p>
        }
      </div>
    </div>
  );
}

export default App;
