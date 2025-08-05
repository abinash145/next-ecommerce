// import NextAuth from "next-auth";

// import { authOptions } from "./auth";

// // export { default } from "next-auth/middleware";
// const { auth } = NextAuth(authOptions);

// // This function can be marked `async` if using `await` inside
// // export async function middleware(request) {
// //   // const { data: session } = getSession();
// //   // console.log("session", session);
// //   //   console.log("I am from middle ware", request);
// //   //   return NextResponse.redirect(new URL("/home", request.url));
// //   const data = getSession();
// //   console.log("data...........................", data);
// //   // const token = await getToken({
// //   //   request,
// //   //   secret: process.env.NEXTAUTH_SECRET,
// //   // });
// //   console.log("request", request);
// //   const isProtectedRoute = request.nextUrl.pathname.startsWith("/seller");

// //   if (isProtectedRoute) {
// //     // const signInUrl = new URL("/login", request.url);
// //     // signInUrl.searchParams.set("callbackUrl", request.url);
// //     // return NextResponse.redirect(signInUrl);
// //   }

// //   return NextResponse.next();
// // }
// export default auth(async (req) => {
//   console.log("req sopkfpods fpodsopf sd ..............", req);
//   // return NextResponse.next();
// });
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/seller",
// };

export { default } from "next-auth/middleware";

export const config = { matcher: ["/seller/:path*"] };
