import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

interface ITodoItem {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const TodoList: React.FC = () =>{
  const initialData: ITodoItem = {
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  };

  const [state, setState] = useState<ITodoItem>(initialData);
  const [data, setData] = useState<ITodoItem[]>([]);
  const [editItem, setEdit] = useState<ITodoItem | null>(null);

  useEffect(() => {
    // Fetch data from the api.
    axios.get<ITodoItem[]>("http://localhost:3000/user")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Fetching error: ', error);
      });
  }, []);

  // Post data in the Api.
  const post = () => {
    axios.post<ITodoItem>("http://localhost:3000/user", state)
      .then((response) => {
        setData([...data, response.data]);
        setState(initialData);
      })
      .catch((error) => {
        console.error("Posting Error: ", error);
      });
  };

  // Delete data from the api
  const remove = (id: number) => {
    axios.delete(`http://localhost:3000/user/${id}/`)
      .then(() => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      })
      .catch((error) => {
        console.error("Deleting Error: ", error);
      });
  }

  const update = (id: number) => {
    const todoToEdit = data.find((item) => item.id === id);
    setEdit(todoToEdit || null);
  };

  const handleUpdate = () => {
    if (editItem) {
      axios.put<ITodoItem>(`http://localhost:3000/user/${editItem.id}/`, editItem)
        .then((response) => {
          const updatedData = data.map((item) =>
            item.id === editItem.id ? response.data : item
          );
          setData(updatedData);
          setEdit(null);
        })
        .catch((error) => {
          console.error("Updating Error: ", error);
        });
    }
  };

  return (
    <>
      {/* Edit Todo */}
      <div className='main'>
        <div className="center">
          {editItem ? (
            <div>
              <div className="inputbox">
                Username <input type='text' value={editItem.username} onChange={(e) => setEdit({ ...editItem, username: e.target.value })} /><br />
                <span>Username</span>
              </div>

              <div className="inputbox">
                Firstname <input type='text' value={editItem.first_name} onChange={(e) => setEdit({ ...editItem, first_name: e.target.value })}/><br />
              <span>Firstname</span>
              </div>

              <div className="inputbox">
               Lastname <input type='text' value={editItem.last_name} onChange={(e) => setEdit({ ...editItem, last_name: e.target.value })}/><br />
              <span>Lastname</span>
              </div>

              <div className="inputbox">
                Email <input type='email' value={editItem.email} onChange={(e) => setEdit({ ...editItem, email: e.target.value })}/><br />
                <span>Email</span>
              </div>

              <div className="inputbox">
                password <input type='password' value={editItem.password} onChange={(e) => setEdit({ ...editItem, password: e.target.value })} /><br />
                <span>password</span>
              </div>

              <div className="inputbox">
                <button onClick={handleUpdate}>Update Data</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="inputbox">
                Username <input type='text' value={state.username} onChange={(e) => setState({ ...state, username: e.target.value })}/><br />
                <span>Username</span>
              </div>

              <div className="inputbox">
                Firstname <input type='text' value={state.first_name} onChange={(e) => setState({ ...state, first_name: e.target.value })}/><br />
                <span>Firstname</span>
              </div>

              <div className="inputbox">
                Lastname <input type='text' value={state.last_name} onChange={(e) => setState({ ...state, last_name: e.target.value })} /><br />
                <span>Lastname</span>
              </div>

              <div className="inputbox">
                Email <input type='text' value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })}
                /><br />
                <span>Email</span>
              </div>

              <div className="inputbox">
                Password <input type='text' value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })}
                /><br />
                <span>Password</span>
              </div>

              <div className="inputbox">
                <button onClick={post}>Post Data</button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Show data from the api */}
      <div className="center">
        <table>
          {data.map((item, uniqueKey) => (
            <tr key={uniqueKey}>
              <td>{uniqueKey}</td>
              <td>{item.username}</td>
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>{item.email}</td>
              <td>{item.password}</td>
              <td><button onClick={() => remove(uniqueKey)}>Delete</button></td>
              <td><button onClick={() => update(uniqueKey)}>Update</button></td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}

export default TodoList;
