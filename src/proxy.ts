import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { headers } from "next/headers";
import { auth } from '@/lib/auth';

// This function can be marked `async` if using `await` inside 
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()  
    });
    const user = session?.user; 
    // console.log(user);
    if(!user){
        return NextResponse.redirect(new URL('/login', request.url))
    }
};

export const config = {
    matcher: ['/dashboard', '/my-bookings', '/add-studio', '/edit', '/my-listings', '/profile'],
}