import React, { useContext } from "react";
import { AccountContext } from "../context/accountContext";
import AnimatedNumber from "../components/AnimatedTag";
export default function TotalHeader({ totalInfo }) {
  const { accounts } = useContext(AccountContext);

  const account = accounts?.find((item) => item._id === totalInfo.account);
  return (
    <>
      {totalInfo.account === "all" ? (
        <div className="total">
          <div className="all-price">
            <h1>
              $<AnimatedNumber number={totalInfo.total} />
            </h1>

            <p>淨資產</p>
          </div>
          <div className="ac">
            <div className="box">
              <h3 style={{ color: "rgb(56, 205, 9)" }}>
                <AnimatedNumber number={totalInfo.income} />
              </h3>
              <p>總資產</p>
            </div>
            <div className="box">
              <h3 style={{ color: "rgb(241, 38, 11)" }}>
                <AnimatedNumber number={totalInfo.expense} />
              </h3>
              <p>總支出</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="total">
          <div className="all-price">
            <h1>
              <AnimatedNumber number={totalInfo.total} />
            </h1>

            <p>餘額</p>
          </div>
          <div className="ac">
            <div className="box">
              <h3 style={{ color: "rgb(56, 205, 9)" }}>
                <AnimatedNumber number={account.initalAmount} />
              </h3>
              <p>初始餘額</p>
            </div>
            <div className="box">
              <h3 style={{ color: "rgb(56, 205, 9)" }}>
                <AnimatedNumber number={totalInfo.income} />
              </h3>
              <p>收入</p>
            </div>

            <div className="box">
              <h3 style={{ color: "rgb(241, 38, 11)" }}>
                <AnimatedNumber number={totalInfo.expense} />
              </h3>
              <p>支出</p>
            </div>
            <div className="box">
              <h3
                style={
                  totalInfo.change >= 0
                    ? { color: "rgb(56, 205, 9)" }
                    : { color: "rgb(241, 38, 11)" }
                }
              >
                <AnimatedNumber number={totalInfo.change} />
              </h3>
              <p>轉帳</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
