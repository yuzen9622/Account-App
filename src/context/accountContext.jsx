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
  const [filterRecords, setFilterRecords] = useState(null);
  const [popOpen, setPopOpen] = useState(null);
  const [queryParams, setQueryParams] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));
  const [updateRecordInfo, setUpdateRecordInfo] = useState(null);
  const [recordInfo, setRecordInfo] = useState(renderRecord);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setCategories(null);
    setAccounts(null);
    setRecords(null);
  }, [user]);

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
          setToken(null);
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
          setToken(null);
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

      const fetchUrl = `${url}/records/`;
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
          setToken(null);
        }
        setMessage({ status: "warning", text: datas.error, open: true });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, token, setToken, setMessage]);
  const filterRecord = useCallback(() => {
    if (!records) return [];

    let result = records.filter((record) => {
      const recordDate = moment(record.date);
      const yearMatch = queryParams.year
        ? recordDate.year() === parseInt(queryParams.year)
        : true;
      const monthMatch = queryParams.month
        ? recordDate.month() + 1 === parseInt(queryParams.month)
        : true;
      const startMatch = queryParams.start
        ? recordDate.isSameOrAfter(moment(queryParams.start))
        : true;
      const endMatch = queryParams.end
        ? recordDate.isSameOrBefore(moment(queryParams.end))
        : true;

      return yearMatch && monthMatch && startMatch && endMatch;
    });
    setFilterRecords(result);
  }, [records, queryParams]);

  const getCurrentRecords = useCallback(async () => {
    try {
      if (!user || !token) {
        return;
      }
      const datas = records?.filter(
        (record) =>
          moment(record.date).format("YYYY-MM-DD") ===
          moment(selectedDate).format("YYYY-MM-DD")
      );
      setCurrentRecords(datas);
    } catch (error) {
      console.log(error);
    }
  }, [user, token, selectedDate, records]);

  const addNewRecord = useCallback(async () => {
    try {
      if (!user || !token || isPending) {
        return;
      }
      setIsPending(true);
      setPopOpen(false);
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
        setRecords((prev) => [...prev, data.record]);
        setRecordInfo(renderRecord);
        setUpdateRecordInfo(null);
        setMessage({
          status: "success",
          text: data.message,
          open: true,
        });
      } else {
        if (data.error === "jwt expired") {
          sessionStorage.removeItem("account-token");
        }
        setPopOpen(true);
        setMessage({
          status: "warning",
          text: data.error,
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  }, [token, user, setToken, recordInfo, renderRecord, isPending, setMessage]);

  const updateRecord = useCallback(async () => {
    try {
      if (!user || !token) {
        return;
      }
      const res = await fetch(`${url}/records/update`, {
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
        setRecords((prev) => {
          return prev.map((item) =>
            item._id === recordInfo._id ? recordInfo : item
          );
        });
        setRecordInfo(renderRecord);
        setUpdateRecordInfo(null);
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
    getAccounts,

    recordInfo,
    renderRecord,
    setMessage,
    setToken,
    token,
    user,
  ]);

  useEffect(() => {
    if (!user || !token) return;
    getCurrentRecords();
  }, [selectedDate, user, records, getCurrentRecords, token]);

  useEffect(() => {
    filterRecord();
  }, [queryParams, filterRecord, records]);

  useEffect(() => {
    if (!user || !token) return;
    Promise.all([getRecords(), getAccounts(), getCategory()]);
  }, [getAccounts, user, token, getCategory, getRecords]);

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
        setUpdateRecordInfo,
        updateRecordInfo,
        recordInfo,
        setRecordInfo,
        renderRecord,
        queryParams,
        setQueryParams,
        setCategories,
        clearQuery,
        updateRecord,
        setAccounts,
        filterRecords,
        isPending,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
