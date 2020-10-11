import React, { useEffect, useRef, useState } from "react";
import { ajax } from "jquery";
import "./App.css";

function App(props) {
  const apiOffset = useRef(0);
  const tableOffset = useRef(0);
  const limit = 5;
  const [dataStore, handleDataStore] = useState([]);
  const [data, handleData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [props]);

  useEffect(() => {
    if (dataStore.length === 0) return;
    updateDisplayData();
  }, [dataStore]);

  const fetchData = () => {
    ajax({
      url: "http://jsonplaceholder.typicode.com/photos",
      type: "GET",
      data: {
        _start: apiOffset.current,
        _limit: limit
      },
      success: (response) => {
        apiOffset.current += limit;
        handleDataStore([...dataStore, ...response]);
      },
      error: console.error
    });
  };

  const paginate = (type) => {
    if (tableOffset.current === 0 && type === "prev") return;

    if (type === "next") {
      tableOffset.current += limit;
    } else {
      tableOffset.current -= limit;
    }
    updateDisplayData();
  };

  const updateDisplayData = () => {
    const _data = dataStore.filter((data, index) => {
      return (
        index >= tableOffset.current && index < tableOffset.current + limit
      );
    });

    if (_data.length < 5) {
      fetchData();
    } else {
      handleData(_data);
    }
  };

  return (
    <div className="App container">
      <table className="w-100">
        <thead>
          <tr>
            <th>Album ID</th>
            <th>Image ID</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Link</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            return (
              <tr key={row.id}>
                <td>{row.albumId}</td>
                <td>{row.id}</td>

                <td>
                  <img
                    src={row.thumbnailUrl}
                    width="60"
                    height="60"
                    alt={row.title}
                  />
                </td>
                <td>{row.title}</td>
                <td>
                  <a href={row.url} target="_blank">
                    OPEN IMAGE
                  </a>
                </td>
                <td>
                  <button
                    className="btn"
                    onClick={() => {
                      const _data = dataStore.filter((image) => {
                        return image.id !== row.id;
                      });
                      handleDataStore(_data);
                    }}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="d-flex align-items-center justify-content-end py-2">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-primary mx-2"
            onClick={() => {
              paginate("prev");
            }}
          >
            PREV
          </button>
          <button
            className="btn btn-primary mx-2"
            onClick={() => {
              paginate("next");
            }}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
