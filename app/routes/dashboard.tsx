import React, { useState } from "react";
import logo_url from "/mar_logo.png?url";
import { Link, Form, MetaFunction, useLoaderData } from "@remix-run/react";
import stylesHref from "../styles/dashboard.scss?url";
import defaultHref from "../styles/default.scss?url"
import { LinksFunction, LoaderFunctionArgs, defer, redirect } from "@remix-run/node";
import { getSession } from "~/.server/auth";
import Footer from "~/components/footer";
import mongoose from "mongoose";
import { Expense, Income, User } from "~/.server/db";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesHref,
    },
    {
      rel: "stylesheet",
      href: defaultHref
    }
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    {
      name: "description",
      content: "MAR Budget Analysis Application ALPHA v0.9",
    },
  ];
};

  export const loader = async ({ 
    request
   }: LoaderFunctionArgs) => {
    const session = await getSession(
      request.headers.get("Cookie")
    );
    if (!session.has("userId")) {
      return redirect("/")
    }
    let userID = session.get("userId");
    await mongoose.connect(process.env.MONGODB_URL!);
    const user = await User.findById(userID);
    const income = await Income.find({ user: userID })
    const expense = await Expense.find({user: userID});
    const name = user.first
    const total_incomes = income.map(entry => entry.amount);
    const total_expenses = expense.map(entry => entry.amount);
    const sum = (arr) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const balance = (sum(total_incomes) + sum(total_expenses)).toFixed(2);
    // USE HASED USER ID TO FIND DB DATA AND GET INFORMATION SUCH AS ALL INCOME AND EXPENSE ADDED TOGETHER TO MAKE BALANCE PLUS LIST OF INCOME AND EXPENSE
    // ACTION WILL ADD TO INCOME DB OR EXPENSE DB.
    return defer({
      name,
      income,
      expense,
      balance
    })
}  

export default function Onboarding() {
  const {income, expense, balance, name} = useLoaderData<typeof loader>();
  return (
    <>
      <div id="grid-container">
        <div id="greeting">
        <p>Hello, {name}</p>
        </div>
        <div id="inner-container">
        <div id="balance">
          <div id="balance-title"><p>Balance</p></div>
          <div id="balance-value"><p>${balance}</p></div>
        </div>
        <div id="grid-container-transaction">
        <div id="latest-transactions">
          <div>
            <p>Latest Transactions</p>
          </div>
          <div id="transactions-container">
            {expense.map(expense => (
            <div className="transaction" key={expense._id}>
          <div className="transaction_group">
              <p style={{
                "textAlign": "start"
              }}>{expense.from}</p>
              <p>${expense.amount}</p>
          </div>
          </div>
        ))}

          </div>
        </div>
        <div id="latest-deposits">
        <div>
            <p>Latest Deposits</p>
          </div>
          <div id="deposits-container">

          {income.map(income => (
            <div className="deposit" key={income._id}>
          <div className="deposit_group">
              <p style={{
                "textAlign": "start"
              }}>{income.from}</p>
              <p>${income.amount}</p>
          </div>
          </div>
        ))}
          </div>
        </div>
        </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}
