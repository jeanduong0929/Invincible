export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/collections/basics", "/collections/tops", "/collections/bottoms"],
};
