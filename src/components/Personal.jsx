function Personal({ resumeData, setResumeData }) {
  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <>
      <h3 className="text-2xl font-semibold mb-6 text-left">
        Personal Information
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="fullName"
            value={resumeData.personal.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            value={resumeData.personal.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            name="phone"
            value={resumeData.personal.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            name="location"
            value={resumeData.personal.location}
            onChange={handleChange}
            placeholder="Enter your location"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary Full Width */}
      <div className="mt-6 flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">
          Professional Summary
        </label>
        <textarea
          name="summary"
          value={resumeData.personal.summary}
          onChange={handleChange}
          placeholder="Write a brief summary about yourself"
          rows={5}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
}

export default Personal;