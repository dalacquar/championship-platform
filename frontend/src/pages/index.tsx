
import { parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import jwt_decode from "jwt-decode"
import { User } from "../interfaces";
import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import {UserContext} from '../context/UserContext'
import Layout from '@/components/layout';
function Home(data:User) {
  const { id,setId,username,setUsername} = useContext(UserContext);

  useEffect(
    () => {
      if(data.id && data.username){
        setId(data.id)
        setUsername(data.username)
      }
    },[data]
  )

  return (
    <Layout>
      <Box>
        <h1>Home Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim atque, cupiditate molestias nam explicabo quaerat ut natus tempora perspiciatis, asperiores optio ratione eaque repellat iste corporis quos aspernatur mollitia labore?lorem</h1>
        <h1>Home Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim atque, cupiditate molestias nam explicabo quaerat ut natus tempora perspiciatis, asperiores optio ratione eaque repellat iste corporis quos aspernatur mollitia labore?lorem</h1>
        <h1>Home Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim atque, cupiditate molestias nam explicabo quaerat ut natus tempora perspiciatis, asperiores optio ratione eaque repellat iste corporis quos aspernatur mollitia labore?lorem</h1>
        <h1>Home Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim atque, cupiditate molestias nam explicabo quaerat ut natus tempora perspiciatis, asperiores optio ratione eaque repellat iste corporis quos aspernatur mollitia labore?lorem</h1>
        <h1>Home Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim atque, cupiditate molestias nam explicabo quaerat ut natus tempora perspiciatis, asperiores optio ratione eaque repellat iste corporis quos aspernatur mollitia labore?lorem</h1>
        <h1>Home Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim atque, cupiditate molestias nam explicabo quaerat ut natus tempora perspiciatis, asperiores optio ratione eaque repellat iste corporis quos aspernatur mollitia labore?lorem</h1>
        <h2><>{id}</></h2>
        <h2>{username}</h2>
      </Box>
    </Layout>

      
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { "championship-token" : token } = parseCookies(context);
  if(!token){
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }

  try {
    // Decodifique o token e armazene o resultado em decodedToken
    const userData:User = jwt_decode(token);

    if(userData.id && userData.username){
      return {
        props: userData
      };
    }else{
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    }
    
  } catch (error) {

    // Se houver um erro ao decodificar o token, redirecione para a página de login
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

};  

export default Home

