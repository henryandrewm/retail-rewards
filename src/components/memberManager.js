import styles from '../styles/memberManager.module.css';
import MemberCard from './memberCard';
import { useEffect, useState } from 'react';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinnerContainer}>
        <div></div>
        <h3>Loading Rewards Members...</h3>
      </div> 
    </div>
  )
}

const Error = ({message}) => {
  return (
    <div className={styles.error}>
      {message}
    </div>
  )
}

export default function MemberManager() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./transactionData.json');
        if (!response.ok) {
          setErrorMessage('Data retrieval failed with status: ' + response.status);
          return;
        }
        setMembers(await response.json());
        setIsLoading(false);
      } catch (error) {
        setErrorMessage('Data retrieval failed with error: ' + error);
      }
    }
    
    getTransactions();
  }, [])

  let memberCards;
  if(!isLoading && !errorMessage && members.length) {
    memberCards = members.map((m, i) => {
      return (
        <MemberCard key={i} firstName={m.firstName} lastName={m.lastName} transactions={m.transactions}/>
      )
    });
  }

  return (
    <div className={styles.memberManagerContainer}>
      <h1>Retail Rewards System</h1>
      {isLoading ? <Loader /> : undefined}
      {errorMessage ? <Error message={errorMessage} /> : undefined}
      {memberCards}
    </div>
  )
}