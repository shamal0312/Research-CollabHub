import React from "react";

const Book = () => {
  const books = [
    { id: 1, title: "Research Methods", author: "John Smith" },
    { id: 2, title: "AI Fundamentals", author: "Sara Lee" },
    { id: 3, title: "Web Development", author: "David Kim" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Online Library</h1>

      <div className="grid gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded-lg shadow">
            <h2 className="font-semibold">{book.title}</h2>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book;