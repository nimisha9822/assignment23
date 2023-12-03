import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const Tabledata = () => {
  const [users, setUsers] = useState([]);
  const [search , setSearch] = useState("");
  const [filteredUser , setFiltereduser] =useState([]);
  


  useEffect(() => {
    // Fetch user data from the provided API
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => {
        setUsers(response.data);
        setFiltereduser(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(()=>{
    const res=users.filter(user =>{
      return user.name.toLowerCase().match(search.toLocaleLowerCase());
    })
    setFiltereduser(res);
  }, [search]);

  const handleDelete = (name)=>{
const updateuser=filteredUser.filter(user => user.name!==name);
setFiltereduser(updateuser);
  }
 
  const columns = [
    {
      name:"Name",
      selector: (row) =>row.name,
    },
    {
      name: "Email",
      selector: (row) =>row.email,
    },
    {
      name:"Role",
      selector: (row)=>row.role,
    },
    {
      name:"Actions",
      cell: (row)=>(<button style={{margin: "25px" ,background: "blue", color: "white"}} onClick={()=>alert(row.id)}>Edit</button>),
      // cell: (row)=> (<button className='btn btn-primary' onClick={handleDelete}>Delete</button>),
    }
  ]
  
  return (
  <>
 {/* <button  onClick={handleDelete} style={{margin: "25px" ,background: "blue", color: "white"}}>Delete</button> */}
  
    <DataTable
    columns={columns}
    data={filteredUser}
    pagination
    fixedHeader
    fixedHeaderScrollHeight='450px'
    selectableRows
    selectableRowsHighlight
    highlightOnHover
    // actions={<button className='btn btn-sm btn-info'>Delete</button>}  
    subHeader
    subHeaderComponent={
      <input
      type="text" placeholder="Search here" style={{width : "300px"}}
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      ></input>
    }  
  
    />
    </>   
  );
 
};

export default Tabledata;