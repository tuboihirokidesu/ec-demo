'use client';

import { Session } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { signIn, signOut } from 'next-auth/react';
import { LogOut, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Props = {
  session: Session | null;
};

export default function UserNavButton({ session }: Props) {
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user && user.image ? (
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.image} alt={user?.name ?? ''} />
            <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        ) : (
          <User2 size={24} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        {user ? (
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className='mr-2 h-4 w-4' />
            <span>Sign out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => signIn()}>
            <LogOut className='mr-2 h-4 w-4' />
            <span>Sign In</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
