import { Session } from "next-auth";

export default interface MySession extends Session {
  _id: string;
  jwt: string;
  role: string;
}
