import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserContext } from "./userContext";
import { url } from "../service";
import moment from "moment";
export const AccountContext = createContext();

export const AccountContextProvider = ({ children }) => {
  const { token, user, setToken, setMessage } = useContext(UserContext);
  const renderRecord = useMemo(
    () => ({
      _id: null,
      userId: user?._id,
      accountId: "",
      categoryId: "",
      source: "expense",
      amount: "",
      date: new Date(),
      description: "",
      toAccountId: "",
    }),
    [user]
  );
  const [categories, setCategories] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [currentRecords, setCurrentRecords] = useState(null);
  const [records, setRecords] = useState(null);
  const [popOpen, setPopOpen] = useState(null);
  const [queryParams, setQueryParams] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));
  const [updateRecord, setUpdateRecord] = useState(null);
  const [recordInfo, setRecordInfo] = useState(renderRecord);

  const today = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${String(new Date().getDate() - 1).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const clearQuery = useCallback(() => {
    setQueryParams({});
  }, []);

  useEffect(() => {
    setRecordInfo(renderRecord);
  }, [renderRecord]);

  const getCategory = useCallback(async () => {
    try {
      if (!user || !token) {
        return;
      }
      const res = await fetch(`${url}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const datas = await res.json();
      if (datas.newToken) {
        setToken(datas.newToken);
        sessionStorage.setItem("account-token", JSON.stringify(datas.newToken));
      }
      if (datas.ok) {
        setCategories(datas.categories);
      } else {
        console.log(datas.error);
        if (datas.error === "jwt expired") {
          sessionStorage.removeItem("account-token");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, token, setToken]);

  const getAccounts = useCallback(async () => {
    try {
      if (!user || !token) {
        return;
      }
      const res = await fetch(`${url}/accounts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const datas = await res.json();
      if (datas.newToken) {
        setToken(datas.newToken);
        sessionStorage.setItem("account-token", JSON.stringify(datas.newToken));
      }
      if (datas.ok) {
        setAccounts(datas.accounts);
      } else {
        console.log(datas.error);
        if (datas.error === "jwt expired") {
          sessionStorage.removeItem("account-token");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, token, setToken]);
  const getRecords = useCallback(async () => {
    try {
      if (!user || !token) {
        return;
      }
      const queryString = new URLSearchParams(queryParams).toString();
      const fetchUrl = `${url}/records${queryString ? `?${queryString}` : ""}`;
      const res = await fetch(fetchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const datas = await res.json();
      if (datas?.newToken) {
        setToken(datas.newToken);
        sessionStorage.setItem("account-token", JSON.stringify(datas.newToken));
      }
      if (datas.ok) {
        setRecords(datas.records);
      } else {
        console.log(datas.error);
        if (datas.error === "jwt expired") {
          sessionStorage.removeItem("account-token");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, token, queryParams, setToken]);

  const getCurrentRecords = useCallback(async () => {
    try {
      if (!user || !token) {
        return;
      }
      let date = new Date(selectedDate);
      date.setDate(date.getDate() + 1);
      date = date.toISOString().split("T")[0];

      const datas = records?.filter(
        (record) => moment(record.date).format("YYYY-MM-DD") === date
      );
      setCurrentRecords(datas);
    } catch (error) {
      console.log(error);
    }
  }, [user, token, selectedDate, records]);

  const addNewRecord = useCallback(async () => {
    try {
      if (!user || !token) {
        return;
      }
      const res = await fetch(`${url}/records/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recordInfo),
      });
      const data = await res.json();
      if (data.newToken) {
        setToken(data.newToken);
        sessionStorage.setItem("account-token", JSON.stringify(data.newToken));
      }
      if (data.ok) {
        getRecords();
        setRecordInfo(renderRecord);
        setUpdateRecord(null);
        getAccounts();
        setPopOpen(false);
        setMessage({
          status: "success",
          text: data.message,
          open: true,
        });
      } else {
        if (data.error === "jwt expired") {
          sessionStorage.removeItem("account-token");
        }
        setMessage({
          status: "warning",
          text: data.error,
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    token,
    user,
    getRecords,
    setToken,
    recordInfo,
    getAccounts,
    renderRecord,
    setMessage,
  ]);

  useEffect(() => {
    if (!user || !token) return;
    getCurrentRecords();
  }, [selectedDate, user, records, getCurrentRecords, token]);

  useEffect(() => {
    if (!user || !token) return;

    getRecords();
  }, [user, getRecords, token, queryParams]);
  useEffect(() => {
    if (!user || !token) return;
    getAccounts();
    getCategory();
  }, [getAccounts, user, token, getCategory]);
  return (
    <AccountContext.Provider
      value={{
        getCategory,
        categories,
        accounts,
        currentRecords,
        selectedDate,
        setSelectedDate,
        getCurrentRecords,
        records,
        setRecords,
        popOpen,
        setPopOpen,
        addNewRecord,
        setCurrentMonth,
        currentMonth,
        setUpdateRecord,
        updateRecord,
        recordInfo,
        setRecordInfo,
        renderRecord,
        queryParams,
        setQueryParams,
        setCategories,
        clearQuery,

        setAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
