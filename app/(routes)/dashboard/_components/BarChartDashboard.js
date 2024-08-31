import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import React from 'react'

const BarChartDashboard = ({ budgetList }) => {
  return (
    <div className='border rounded-lg p-5'>
      <h2 className='font-bold text-lg'>Activity</h2>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart
          data={budgetList}
          margin={
            {
              top: 10,
            }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" />
          <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartDashboard
