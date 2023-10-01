export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/collections/:path*", "/products/:paths*", "/cart"],
};
