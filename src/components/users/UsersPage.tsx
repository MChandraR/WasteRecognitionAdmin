"use client";
import React, { useState, useRef, useEffect, ReactNode, useMemo } from "react";
import {Table, TextInput, Title, Select, Button, Modal, Pagination, Text, Alert} from "@mantine/core"
import UserService from "@/service/UserService";
import UserData from "@/models/domain/UserData";
import { MdDeleteOutline } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { VscDebugRestart } from "react-icons/vsc";


interface UserDataAlert {
  title : string ;
  message : string;
  color : string;
}

const UserPage: React.FC = () => {
  const [tableRow, setTableRow] = useState<ReactNode>()
  const [userDatas, setUserData] = useState<UserData[]>([])
  const [searchKey, setSearchKey] = useState<String>("")
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [currentUserData, setCurrentUserData] = useState<UserData>({id:"",username:"", password : "", email : "", role : "user", is_assigned : false})
  const [showConfirmDialog, { open, close }] = useDisclosure(false);
  const [currentPageIndex , setCurrentPageIndex] = useState<number>(1);
  const numOfDataperPage = 10;
  const [showInputDataAlert, setShowInputDataAlert] = useState<boolean>(false);
  const [inputAlertContent, setInputAlertContent] = useState<UserDataAlert>({title:"Title", message:"message", color : "blue"})
 
  useEffect(()=>{
    fetchUserData();
  },[]);

  let filteredData = useMemo(()=>{
    if(!userDatas) return;
    const loweredSearchKey = searchKey.toLowerCase()
    return userDatas.filter((user)=>{
      return (
        user.username.toLocaleLowerCase().includes(loweredSearchKey) ||
        user.email.toLocaleLowerCase().includes(loweredSearchKey) ||
        user.role.toLowerCase().includes(loweredSearchKey) ||
        String(user.is_assigned).toLocaleLowerCase().includes(loweredSearchKey)
      )
    });

  },[userDatas, searchKey]);

  function invokeFunctionAfter(action : ()=>void, milis : number){
    setTimeout(()=>{action ; console.log("Invoked functino")}, milis)
  }

  function fetchUserData(){
    UserService.getAllUserData().then((data)=>{
      setUserData(data ?? [])
    })
  }

  function handleClearUserData(){
    setShowInputDataAlert(false);
    setCurrentUserData({
      id : "",
      username : "",
      password : "",
      role : "user",
      email : "",
      is_assigned : false
    })
  }

  function handleSubmitForm(){
      if(currentUserData.password && currentUserData.username != "" && currentUserData.role != "" && currentUserData.email != ""){
        UserService.createNewuser({
          username : currentUserData.username,
          password : currentUserData.password,
          email : currentUserData.email,
          role : currentUserData.role,
          is_assigned : currentUserData.is_assigned
        }).then((response)=>{
          if(response.status == 201){
            fetchUserData();
          }
          setInputAlertContent({
            title : response.status == 201 ? "Sukses!" : "Error !",
            message : response.message,
            color : response.status == 201 ? "green" : "red"
          });
          setShowInputDataAlert(true);
        }).catch((response)=>{
          alert(response.message);
        })
      }else{
        setInputAlertContent({
          title : "Input Tidak Valid",
          message : "Data harus diisi dengan lengkap !",
          color : "red"
        });
        setShowInputDataAlert(true);
        invokeFunctionAfter(()=>{setShowInputDataAlert(false)},3000);
      }
  }

  function handleDeleteUserData(){
    UserService.deleteUserData(currentUserData.id).then((response)=>{
      if(response.status==200) fetchUserData();
      close();
    });
  }

   function handleUpdateData(){
    
      UserService.updateUserData({
        id : currentUserData.id,
        username : currentUserData.username,
        password : currentUserData.password ?? "",
        email : currentUserData.email,
        role : currentUserData.role,
        is_assigned : currentUserData.is_assigned
      }).then((response)=>{
        if(response.status == 200){
          fetchUserData();
        }
        alert(response.message);
        console.log(response);

      }).catch((response)=>{
        alert(response.message);
      })
      
  }

  return (
    <>
      <Modal opened={showConfirmDialog} zIndex={10} onClose={close} title="Delete User ?" overlayProps={{
        opacity : 0.3
      }} centered >
        <Title order={3}>Yakin ingin menghapus akun ?</Title>
        <div className="flex justify-end gap-2 mt-5">
            <Button onClick={handleDeleteUserData}>Ya</Button>
            <Button variant="light" color="red">Tidak</Button>
        </div>
      </Modal>

     

      <div className="flex flex-col gap-4"> {/* Container utama dengan jarak antar elemen */}
       
        <div className="overflow-x-auto grid grid-cols-[40%_auto] gap-5">
          <div className="w-full mt-5 rounded-md mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <Title order={3}>User Data</Title>
            <div className="mt-5 grid grid-rows-1 gap-5">

              <TextInput
                error={(showInputDataAlert && currentUserData?.username == "") ? "Username harus diisi !" :""}
                className="w-full"
                value={String(currentUserData?.username)}
                onChange={(event) => setCurrentUserData({...currentUserData, username : event.currentTarget.value })}
                placeholder="Masukkan username pengguna   "
              />
              <TextInput
                error={(showInputDataAlert && currentUserData?.password == "") ? "Password harus diisi !" :""}
                className="w-full"
                value={String(currentUserData?.password ?? "")}
                onChange={(event) => setCurrentUserData({...currentUserData, password : event.currentTarget.value ?? ""})}
                placeholder="Masukkan password"
              />
              <TextInput
                error={(showInputDataAlert && currentUserData?.email == "") ? "Email harus diisi !" :""}
                className="w-full"
                value={String(currentUserData?.email)}
                onChange={(event) => setCurrentUserData({...currentUserData, email : event.currentTarget.value })}
                placeholder="Masukkan email pengguna"
              />
             <Select
                value={currentUserData.role}
                onChange={(event)=>setCurrentUserData({...currentUserData, role : event ?? "user"})}
                placeholder="Pick value"
                data={['user', 'admin']}
              />
              <Select
                className="w-full"
                value={String(currentUserData.is_assigned)}
                onChange={(value) => {
                  console.log(value)
                  if (value !== null) {
                    const boolValue = value === 'true'; 
                    
                    setCurrentUserData({
                      ...currentUserData, 
                      is_assigned: boolValue 
                    });
                  }
                }}
                data={[
                    { value: 'true', label: 'Ditugaskan' },
                    { value: 'false', label: 'Tidak Ditugaskan' }
                  ]}
              />
              <Alert variant="light" withCloseButton onClose={()=>{setShowInputDataAlert(false)}} color={inputAlertContent.color} title={inputAlertContent.title} hidden={!showInputDataAlert}>
                {inputAlertContent.message}
              </Alert>
              <div className="flex justify-between items-center gap-3 mt-5">
                <Button leftSection={<VscDebugRestart />} variant="light" color="gray" onClick={handleClearUserData}>Clear</Button>
                <div className="flex justify-end items-center gap-3">
                  <Button variant="filled" color="indigo" onClick={handleUpdateData}>Update</Button>
                  <Button variant="light" color="indigo" onClick={handleSubmitForm}>Create New User</Button>
                </div>
              </div>
          </div>
        </div>
        <div>
          <div className="flex justify-end items-center w-full gap-3 mb-5 mt-3"> 
            <Title order={5}>Search : </Title>
            <TextInput
              className="w-full sm:w-1/2 lg:w-1/3"
              value={String(searchKey)}
              onChange={(event) => setSearchKey(event.currentTarget.value)}
              placeholder="Masukkan kata kunci pencarian"
            />
          </div>
          <Table highlightOnHover className="mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Username</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Ditugaskan</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredData?.map((userData, index) => { 
                if(index >= ((currentPageIndex-1)*numOfDataperPage) && index < ( (currentPageIndex) * numOfDataperPage)){
                  return(
                    <Table.Tr key={userData.id} 
                    onClick={(event)=>{
                      setCurrentUserData(userDatas[index])
                      setSelectedIdx(index)
                    }}
                    bg={selectedIdx == index ? "#4db8ff33" : ""}>
                      <Table.Td>{userData.username}</Table.Td>
                      <Table.Td>{userData.email}</Table.Td>
                      <Table.Td>{userData.role}</Table.Td>
                      <Table.Td>
                        {userData.is_assigned ? "Ya" : "Tidak"}
                      </Table.Td>
                      <Table.Td className="flex justify-end mr-4">
                        <Button variant="light" color="red">
                          <MdDeleteOutline size={25} onClick={open}/>
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  )
                }
                } 
                )
              }
            </Table.Tbody>
          </Table>

          <div className="flex justify-between mt-5" >
            <div> 
              <Text>Total Data : {userDatas.length}</Text>
            </div>
            <Pagination value={currentPageIndex} onChange={(index) => setCurrentPageIndex(index)} total={userDatas.length/numOfDataperPage} color="indigo" />
          </div>

        </div>
        </div>
      </div>
    </>
  );
  
};

export default UserPage;
