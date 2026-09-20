import StatisticLine from './StatisticLine'

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="total" value={total} />
      <StatisticLine text="average" value={(good - bad) / total} />
      <StatisticLine text="positive" value={(good / total) * 100 + ' %'} />
    </div>
  )
}

export default Statistics
