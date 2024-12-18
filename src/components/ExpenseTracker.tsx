import { useState } from "react";
import ChartDisplay from "./ChartDisplay";

type Entry = {
  id: number;
  type: "Income" | "Expense";
  description: string;
  amount: number;
  date: string; // Date as a string
};

function ExpenseTracker() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"Income" | "Expense">("Income");
  const [date, setDate] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleAddEntry = () => {
    if (!description || amount <= 0 || !date) {
      alert("Please provide valid inputs.");
      return;
    }

    if (editId !== null) {
      // Edit existing entry
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editId
            ? { ...entry, description, amount, type, date }
            : entry
        )
      );
      setEditId(null);
    } else {
      // Add new entry
      const newEntry: Entry = {
        id: Date.now(),
        type,
        description,
        amount,
        date,
      };
      setEntries((prev) => [...prev, newEntry]);
    }

    // Clear form
    setDescription("");
    setAmount(0);
    setType("Income");
    setDate("");
  };

  const handleDeleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleEditEntry = (entry: Entry) => {
    setEditId(entry.id);
    setDescription(entry.description);
    setAmount(entry.amount);
    setType(entry.type);
    setDate(entry.date);
  };

  const totalIncome = entries
    .filter((e) => e.type === "Income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries
    .filter((e) => e.type === "Expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3>{editId ? "Edit Entry" : "Add Entry"}</h3>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "10px" , fontSize:"20px" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ marginRight: "10px" , fontSize:"20px" }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "Income" | "Expense")}
          style={{ fontSize:"20px" }}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: "10px", marginRight: "10px" ,  fontSize:"20px"}}
        />
        <button onClick={handleAddEntry} style={{ marginLeft: "10px" }}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="summary-box">
        <h3>Summary</h3>
        <p>Total Income: ₹{totalIncome}</p>
        <p>Total Expense: ₹{totalExpense}</p>
        <p>Balance: ₹{balance}</p>
      </div>

      <h3>Entries</h3>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} style={{ marginBottom: "10px" }}>
            <strong>{entry.type}:</strong> {entry.description} - ₹{entry.amount}{" "}
            on {entry.date}
            <button
              onClick={() => handleEditEntry(entry)}
              style={{ marginLeft: "10px", color: "blue", cursor: "pointer" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteEntry(entry.id)}
              style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3>Monthly Trends</h3>
      <ChartDisplay entries={entries} />
    </div>
  );
}

export default ExpenseTracker;
