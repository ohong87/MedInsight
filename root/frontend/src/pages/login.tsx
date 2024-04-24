import { useLogin } from "@refinedev/core";
import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { CredentialResponse } from "../interfaces/google";
import { jwtDecode } from 'jwt-decode';

// console.log(process.env.GOOGLE_CLIENT_ID);

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();
  //createUser function
  const createUser = async(userId: string) => {
    try{
      console.log('Sending userId:',userId);
      const response = await fetch('http://localhost:8080/user',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userId })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  const checkUserExists = async(userId: string) => {
    try {
      const response = await fetch('http://localhost:8080/user/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if(response.status === 200) {
        const user = await response.json();
        console.log('User found:', user);
        return true;
      }
      else if(response.status === 404) {
        console.log('User not found');
        return false;
      }
      else {
        console.error('Unexpected error:', response.statusText);
        return false;
      }
    }
    catch(error) {
      console.error('Error check for user existence:', error);
      return false;
    }
  }
  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }
      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              const decodedToken = jwtDecode(res.credential);
              const userId = decodedToken.sub;
              if(userId){
                login(res);
                //call createUser when logging into application
                const exists = checkUserExists(userId);
                if(!exists) {
                  createUser(userId);
                }
              } else{
                console.error("No userid found");
              }
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []);

    return <div ref={divRef} />;
  };

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9F9F9"
      }}
    >
      
      
      <Box
        display="flex"
        gap="36px"
        justifyContent="center"
        flexDirection="column"
        style={{
          backgroundColor: "#2C4F6F"}}
      >

        <GoogleButton />
      </Box>
    </Container>
  );
};
