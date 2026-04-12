"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import {Table} from "@mantine/core"
import UserService from "@/service/UserService";

const UserPage: React.FC = () => {
  const [tableRow, setTableRow] = useState<ReactNode>()

  useEffect(()=>{
    UserService.getAllUserData().then((data)=>{
      console.log(data)
      console.log(typeof data)
      if(data != undefined){
          setTableRow(data?.map<React.ReactNode>( (userData)=>(
            <Table.Tr key={userData.id}>
              <Table.Td>{userData.id}</Table.Td>
              <Table.Td>{userData.username}</Table.Td>
              <Table.Td>{userData.email}</Table.Td>
              <Table.Td>{userData.role}</Table.Td>
              <Table.Td>{userData.is_assigned}</Table.Td>
            </Table.Tr>
          )))
      }
    })
  },[]);

  return (
     <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Element position</Table.Th>
          <Table.Th>Element name</Table.Th>
          <Table.Th>Symbol</Table.Th>
          <Table.Th>Atomic mass</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{tableRow}</Table.Tbody>
    </Table>
  );
  
};

export default UserPage;
