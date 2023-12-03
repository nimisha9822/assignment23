import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tabledata2 = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch user data from the provided API
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(user =>
      Object.values(user).some(value => value.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectRow = (id) => {
    const index = selectedRows.indexOf(id);
    if (index === -1) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAll = () => {
    const allRowIds = filteredUsers.map(user => user.id);
    if (selectedRows.length === allRowIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };

  const handleDeleteSelected = () => {
    // Implement logic to delete selected rows in memory
    const updatedUsers = filteredUsers.filter(user => !selectedRows.includes(user.id));
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };
  
  const handleDelete=(name)=>{
    const updateUseer = filteredUsers.filter(user=> user.name!=name );
    setFilteredUsers(updateUseer);
    console.log(filteredUsers)
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button className="search-icon" onClick={handleSearch}>Search</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(user => (
            <tr key={user.id} style={{ background: selectedRows.includes(user.id) ? '#ccc' : 'none' }}>
              <td>{user.id}</td>
              <td contentEditable={true} suppressContentEditableWarning={true}>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="delete-btn" onClick={()=>handleDelete(user.name)} >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => handlePageChange(1)} className="first-page">First</button>
        <button onClick={() => handlePageChange(currentPage - 1)} className="previous-page">Previous</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} className="next-page">Next</button>
        <button onClick={() => handlePageChange(totalPages)} className="last-page">Last</button>
      </div>

      <button onClick={handleDeleteSelected} className="delete-selected-btn">Delete Selected</button>
      <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === pageSize} />
    </div>
  );
};

export default Tabledata2;