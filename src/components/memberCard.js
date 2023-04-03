import styles from '../styles/memberCard.module.css';

const monthLongNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const calculatePointsFromTotal = (total) => {
  // Round down to ensure that points are based on whole values only
  const roundedTotal = Math.floor(total);

  if (roundedTotal <= 50) return 0;
  if (roundedTotal <= 100) return roundedTotal - 50; 

  const decimalSplit = ((roundedTotal - 100) / 100).toFixed(1).split('.').map(i => parseInt(i));
  return 50 + (decimalSplit[0] * 200) + (decimalSplit[1] * 20);
};

const Summary = ({count, total, points}) => {
  return (
    <>
      <p>Transactions: <span>{count}</span></p>
      <p>Points Earned: <span>{points}</span></p>
      <p>Total Spent: <span>${parseFloat(total).toFixed(2)}</span></p>
    </>
  )
};

export default function MemberCard (props) {
  const monthlySummaries = [];
  let totalSpent = 0;
  let totalPoints = 0;
  let monthlySummaryComponents = <p>No recent transactions were found for this member.</p>;

  const sortedTransactions = props.transactions?.sort((a, b) => {
    if (new Date(b.date) > new Date(a.date)) return -1; 
    return 0;
  });
  
  sortedTransactions?.forEach(st => {
    const month = monthLongNames[new Date(st.date).getMonth()];
    const summaryIndex = monthlySummaries.findIndex(s => s.month === month);
    const points = st.total ? calculatePointsFromTotal(st.total) : 0;

    if (summaryIndex === -1) {
      monthlySummaries.push({
        month,
        points,
        count: 1,
        total: st.total,
      });
    } else {
      monthlySummaries[summaryIndex].count += 1;
      monthlySummaries[summaryIndex].total += st.total;
      monthlySummaries[summaryIndex].points += points;
    }

    totalSpent += st.total;
    totalPoints += points;
  });
  
  if (monthlySummaries?.length) {
    monthlySummaryComponents = monthlySummaries.map(ms => {
      return (
        <div className={styles.monthlySummaryContainer} key={ms.month}>
          <h4>{ms.month}</h4>
          <Summary 
            count={ms.count} 
            total={ms.total} 
            points={ms.points}
          />
        </div>
      )
    });
  }

  const totalSummary = (
    <Summary 
      count={props.transactions?.length} 
      total={totalSpent} 
      points={totalPoints}
    />
  );
  
  return (
    <div className={styles.memberCardContainer}>
      <div className={styles.cardBody}>
        <h2>{props.firstName + ' ' + props.lastName}</h2>
        <div className={styles.transactionContainer}>
          <h3>Progress By Month</h3>
          <div className={styles.transactionList}>
            {monthlySummaryComponents}
          </div>
        </div>
        <div className={styles.summaryContainer}>
          <h3>Summary</h3>
          {totalSummary}
        </div>
      </div>
    </div>
  )
}