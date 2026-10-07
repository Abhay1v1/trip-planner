import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

const Header = () => {

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', syncUser);
    window.addEventListener('authChange', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('authChange', syncUser);
    };
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setUser(resp.data);
      window.dispatchEvent(new Event('authChange'));
      setOpenDialog(false);
    }).catch((error) => {
      console.error('Google profile fetch failed:', error);
    });
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    window.location.reload();
  };

  return (
    <div className='flex justify-between items-center p-3 px-4'>
      <a href="/">
        <img src='/logo.svg' alt="logo" className='cursor-pointer' />
      </a>
      <div>
       {user ? 
       <div className='flex items-center gap-4'>
        <a href="/create-trip">
         <Button variant="outline" className= "rounded-full">Create Trip</Button> 
        </a>
        <a href="/my-trips">
        <Button variant="outline" className= "rounded-full">My Trips</Button> 
        </a>
         <Popover>
          <PopoverTrigger>
            <img src={user?.picture} className='rounded-full w-[38px] h-[38px]' />
          </PopoverTrigger>
          <PopoverContent>
            <h2 className="cursor-pointer font-medium hover:text-red-600 transition-colors" onClick={handleLogout}>Logout</h2>
          </PopoverContent>
         </Popover>

       </div>
       : <Button onClick={()=>setOpenDialog(true)}>Sign In</Button> 
       }
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="logo" />
              <h2 className="font-bold text-lg mt-6">Sign In with Google</h2>
              <p>Sign In to the App with Google authentication securely</p>
              <Button 
              onClick={login} className="w-full mt-5 flex gap-4 items-center">
                <FcGoogle className="h-7 w-7"/>
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Header
