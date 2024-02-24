const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface User {
    username: string;
    email: string;
    bloodType: string;
    // will add more properties as later
}

export async function getUsers() {
    const response = await fetch(`${apiUrl}/users`);
    const data = await response.json();
    return { props: { data } }
}

export async function getCurrentUser() {
    // const response = await fetch(`${apiUrl}/user`);
    // const data = await response.json();
    const data: User = { 
      username: 'testuser',
      email: 'test@bloodplus.com',
      bloodType: 'A+',
    };
    return { props: { data } }
}
