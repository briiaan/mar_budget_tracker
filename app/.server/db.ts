import mongoose, { Model } from "mongoose";
import crypto from "crypto";
const { Schema, model, models } = mongoose;

interface IUser {
  first: string;
  last: string
  email: string;
  hash: string;
  dob?: string;
  goal?: string;
  username?: string;
  iv: string;
  hashed_user: string;
  salt: string;
}

interface UserMethods extends Model<IUser> {
  findByEmail(): Model<IUser, UserMethods>;
  setPassword(): void;
  validPassword(): boolean;
}

interface IExpense {
  amount: number;
  to: string;
  date: Date;
  user: string;
}

interface Iincome {
  amount: number;
  from: string;
  date: Date;
  user: string;
}

interface IBusiness {
  name: string;
  type_of_business: number;
}

const UserSchema = new Schema<IUser, UserMethods>(
  {
    first: { type: String, required: true }, // name
    last: {type: String, required: true},
    email: { type: String, required: true }, // email
    hash: { type: String }, // password
    dob: String, // date of birth
    goal: Number, // goal
    username: String,
    iv: String, // key for user_id hash
    hashed_user: String, // hashed user_id
    salt: String, // key for hash
  },
  {
    statics: {
      findByEmail(email: string) {
        return this.find({ email: new RegExp(email, "i") });
      },
    },
  },
);

UserSchema.method("setPassword", function setPassword(password: string): void {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
});

UserSchema.method("validPassword", function validPassword(password): boolean {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
});

const ExpenseSchema = new Schema<IExpense>({
  amount: { type: Number, required: true },
  to: { type: String, required: true },
  date: { type: Date, default: new Date() },
  user: String,
});

const IncomeSchema = new Schema<Iincome>({
  amount: { type: Number, required: true },
  from: { type: String, required: true },
  date: { type: Date, default: new Date() },
  user: String,
});

const BusinessSchema = new Schema<IBusiness>({
  name: String,
  type_of_business: Number,
});

const User = models.User || model<IUser>("User", UserSchema);
const Expense = models.Expense || model<IExpense>("Expense", ExpenseSchema);
const Income = models.Income || model<Iincome>("Income", IncomeSchema);
const Business =
  models.Business || model<IBusiness>("Business", BusinessSchema);

export { User, Expense, Income, Business };
