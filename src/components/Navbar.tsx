import React, { useEffect, useState } from "react";
import { getUserData, SearchSong } from "../lib/api";
import { useDispatch } from "react-redux";
import styles from "../styles/components/Navbar.module.scss";
import { setSearchResult } from "../slices/searchSlice";

function Navbar() {
  const dispacth = useDispatch();
  const [query, setquery] = useState("");
  const [userImage, setuserImage] = useState("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const SearchResulsts = await SearchSong(query);
      
      dispacth(setSearchResult(SearchResulsts));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);
  useEffect(() =>{
    (async () =>{
      const userData = await getUserData();
      setuserImage(userData.image);
    })()
  })
  return (
    <div>
      <nav>
        <div className={styles["nav-wrapper"]}>
          <div className={styles.search_box}>
            <div className={styles.srch_logo}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L19 19M10.5 20C11.7476 20 12.9829 19.7543 14.1355 19.2769C15.2881 18.7994 16.3354 18.0997 17.2175 17.2175C18.0997 16.3354 18.7994 15.2881 19.2769 14.1355C19.7543 12.9829 20 11.7476 20 10.5C20 9.25244 19.7543 8.0171 19.2769 6.86451C18.7994 5.71191 18.0997 4.66464 17.2175 3.78249C16.3354 2.90033 15.2881 2.20056 14.1355 1.72314C12.9829 1.24572 11.7476 1 10.5 1C7.98044 1 5.56408 2.00089 3.78249 3.78249C2.00089 5.56408 1 7.98044 1 10.5C1 13.0196 2.00089 15.4359 3.78249 17.2175C5.56408 18.9991 7.98044 20 10.5 20V20Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              className={styles.srch_inp}
              type="text"
              placeholder="Search"
              onChange={(e) => setquery(e.target.value)}
            />
          </div>
          <div className={styles.avatar_box}>
            <div className={styles.avatar}>
              <img src={userImage} alt="avatar" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
