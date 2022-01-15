import { ethers } from "ethers";
import React, { FC, useEffect, useState } from "react";
import { contractABI, contractAddress } from "../utils/constants";

type FormData = {
  addressTo: string;
  amount: string;
  keyword: string;
  message: string;
};

export interface AppContextInterface {
  connectWallet: () => void;
  currentAccount: string;
  transactions: any;
  isLoading: any;
  formData: FormData;
  setformData: (data: FormData) => void;
  handleChange: (e: Event, name: string) => void;
  sendTransaction: () => void;
}

// creating a context for centeralized data
export const TransactionContext =
  React.createContext<AppContextInterface | null>(null);

// @ts-ignore
const { ethereum } = window; // since using metamask, we can access to the ethereum object throw the window

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

// fetch our ethereum contract
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

// creating transacion provider for the app (wrapper around the app)
export const TransactionProvider: FC = ({ children }) => {
  const [currentAccount, setcurrentAccount] = useState("");
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  // handle form change
  const handleChange = (e: Event, name: string) => {
    // @ts-ignore
    setformData((prevState) => ({ ...prevState, [name]: e?.target?.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction: any) => {
            return {
              addressTo: transaction.reciever,
              addressFrom: transaction.sender,
              timestamp: new Date(
                transaction.timestamp.toNumber() * 1000
              ).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / 10 ** 18,
            };
          }
        );

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      // check if user has metamask
      if (!ethereum) return alert("Please install Metamask!");
      // if there is metamask, get the accounts
      const accounts = await ethereum.request({ method: `eth_accounts` });

      if (accounts.length) {
        setcurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("no accounts found");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactinCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      throw new Error("No ethereum object.");
    }
  };

  // on click to call this function for connecting to the account
  const connectWallet = async () => {
    try {
      // check if user has metamask
      if (!ethereum) return alert("Please install Metamask!");
      // request the connection
      const accounts = await ethereum.request({
        method: `eth_requestAccounts`,
      });
      setcurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };

  // send transaction call
  const sendTransaction = async () => {
    try {
      // check if user has metamask
      if (!ethereum) return alert("Please install Metamask!");

      // get the data from the form
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      //
      // parse the amount from decimal to GWEI which only form can be accepted by ethereum
      const parsedAmount = ethers.utils.parseEther(amount);

      //send transactions from one address to another
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //21000 GWEI in hex
            value: parsedAmount._hex, // amount in hex
          },
        ],
      });

      // then store the transaction through the SC
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      // set loading
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      // wait until the transaction done (takes up to 30sec), then
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      // reset the transaction counter
      const transactionCount = await transactionContract.getTransactinCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };

  // first we check if our wallet is connected
  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        transactions,
        formData,
        setformData,
        handleChange,
        sendTransaction,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
