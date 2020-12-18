import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {InputPicker,Loader,Nav,Input,Tag, Button, Navbar, Icon, IconButton} from "rsuite"
import { func } from 'prop-types'
import openSocket from 'socket.io-client';
import jwt from "jsonwebtoken"


import JoditEditor from "jodit-react";

const  socket = openSocket('/');

export default function Reg() {
   // console.log(jwt.sign({house:location.search.match(/h=(.*)/)[1] },"token"));
    let houseData = jwt.verify(location.search.match(/h=(.*)/)[1],"token" );
    let house=houseData.house
    
    let [data,setData]=useState(null)
    let [Cat,setCat]=useState(null)
    let [Prog,setProg]=useState(null)
   

    useEffect(e=>{
        axios.get("/getRegProgs").then(res=>{
            setData(res.data)
        })
        console.log(house);
        
    },[])
    useEffect(e=>{
        console.log(data);
        let handler=(e)=>{
            let ThData={...data}
            console.log(ThData);
            ThData.regedProg.push(e)
           
    
            setData(ThData)
        }
        socket.on("added",handler)
        return () => {
            socket.off('added', handler);
          }
    },[data])

    useEffect(e=>{
        console.log(data);
        let handler=(e)=>{
            let ThData={...data}
            let Indx=ThData.regedProg.findIndex(_e=>_e.Time==e.Time)
            console.log("eeeeee",Indx);
            let qxxx=ThData.regedProg.splice(Indx,1)
           
            console.log(ThData,qxxx);
            setData(ThData)
        }
        socket.on("removed",handler)
        return () => {
            socket.off('removed', handler);
          }
    },[data])

    function filterCat(){
        if(Cat){
            return data.programs.filter(e=>e.catagory==Cat)
        }else{
            return []
        }
    }
    function filterRegedProg(){
        if(Prog){
            
            return data.regedProg.filter(e=>e.catagory==Cat).filter(e=>e.prog==Prog)

        }else{
            return []
        }
    }
    let InputVal=""
    return (
        <div className="_Cont">
            {!data&&<Loader/>}
            {
                data&&
                <div>
                    
                    <Navbar>
                        <Nav>
                            <div style={{display:"flex",margin:"10px"}}>
                                <InputPicker style={{margin:"auto"}} onChange={(e)=>{setCat(e)}} data={RsuitFy(data.catagories)}></InputPicker>
                            </div>
                        </Nav>
                        <Nav onSelect={(e)=>{setProg(e)}}>
                            {filterCat().map(e=>{
                            return(
                                    <Nav.Item eventKey={e.Name}>
                                        {e.Name}
                                    </Nav.Item>
                                )
                            })}
                        </Nav>
                    </Navbar>
                    <h1>{house}</h1>
                    {Prog&&
                        <div className="_prg">
                            <div>
                                <div className="griddd">
                                    <div className="rgProgs">
                                        <h6>Registered {Prog} for {Cat}</h6>

                                        {filterRegedProg().map(e=>{
                                            return(
                                                <div dangerouslySetInnerHTML={{ __html: e.cont }} className="card"></div>
                                            )
                                        })}
                                    </div>
                                    
                                    
                                        
                                        <div className="rgProgs">
                                            <h6>Registered by {house}</h6>
                                            {filterRegedProg().filter(e=>e.house==house).map(e=>{
                                                return(
                                                    <div className="card">
                                                        <div className="Head">
                                                            <IconButton onClick={()=>{
                                                                axios.post("./crud/",{
                                                                    action:"Delete",
                                                                    data:{
                                                                        Time:e.Time
                                                                    }
                                                                })
                                                            }} icon={<Icon icon="close-circle"></Icon>}></IconButton>
                                                        </div>
                                                        <div  dangerouslySetInnerHTML={{ __html: e.cont }} ></div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                            
                                    
                                </div>    
                                <div>
                                    <h6>Register Your </h6>
                                    <JoditEditor  onChange={(e)=>{InputVal=e;console.log(e)}}></JoditEditor>
                                    <Button onClick={()=>{
                                        axios.post("./crud/",{
                                            action: "Add",
                                            data: {
                                                    cont:InputVal,
                                                    prog:Prog,
                                                    catagory:Cat,
                                                    house:house
                                                }
                                        })
                                    }}>Add</Button>
                                </div>
                            </div>
                        </div>
                        
                    }
                </div>
                
            }
        </div>
    )
}

function RsuitFy(arr){
    let Arr=[]

    arr.forEach((e,i)=>{
        Arr[i]={label:e,value:e}
    })

    return Arr
}


