import { useSearchParams } from "react-router-dom";
import Acc from "./Acc";
import Sett from "./Sett";
import React, { useEffect, useLayoutEffect, useState } from 'react'

export default function Account() {

    const [user, setuser] = useState(sessionStorage.getItem("user"));


    return (<>
        {user ? <Sett /> : <Acc />}
    </>)
}
