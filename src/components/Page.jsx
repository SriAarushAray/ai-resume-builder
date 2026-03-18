function Page({ children, pageNumber, totalPages }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-[794px] min-w-[794px] bg-white shadow-lg"
        style={{
          width: "794px",
          height: "1123px",
          padding: "40px",
        }}
      >
        {children}

        {/* Page footer */}
        <div className="absolute bottom-4 right-6 text-xs text-gray-500">
          Page {pageNumber}/{totalPages}
        </div>
      </div>
    </div>
  );
}

export default Page;