import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";

import { db } from "./db";

export type LoginForm = {
  username: string;
  password: string;
};

export type SignUpForm = {
  name: string;
  email: string;
  password: string;
  dob: string;
  saving_goal: string;
};

export async function login() {}
