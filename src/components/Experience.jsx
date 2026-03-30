function Experience({ resumeData, setResumeData }) {
	const experiences = resumeData.experiences || [];

	const addExperience = () => {
		setResumeData((prev) => ({
			...prev,
			experiences: [
				...(prev.experiences || []),
				{ company: "", role: "", duration: "", description: "" },
			],
		}));
	};

	const updateExperience = (index, field, value) => {
		setResumeData((prev) => {
			const updated = [...(prev.experiences || [])];
			updated[index] = {
				...updated[index],
				[field]: value,
			};

			return {
				...prev,
				experiences: updated,
			};
		});
	};

	const removeExperience = (indexToRemove) => {
		setResumeData((prev) => ({
			...prev,
			experiences: (prev.experiences || []).filter((_, index) => index !== indexToRemove),
		}));
	};

	return (
		<div className="mt-8">
			<h3 className="text-xl font-semibold mb-4 text-left">Experience</h3>

			<div className="space-y-4">
				{experiences.map((experience, index) => (
					<div key={index} className="border p-3 rounded">
						<input
							type="text"
							placeholder="Company"
							value={experience.company}
							onChange={(e) => updateExperience(index, "company", e.target.value)}
							className="w-full border p-2 mb-2 rounded"
						/>

						<input
							type="text"
							placeholder="Role"
							value={experience.role}
							onChange={(e) => updateExperience(index, "role", e.target.value)}
							className="w-full border p-2 mb-2 rounded"
						/>

						<input
							type="text"
							placeholder="Duration (e.g. Jan 2023 - Mar 2025)"
							value={experience.duration}
							onChange={(e) => updateExperience(index, "duration", e.target.value)}
							className="w-full border p-2 mb-2 rounded"
						/>

						<textarea
							placeholder="Description"
							value={experience.description}
							onChange={(e) => updateExperience(index, "description", e.target.value)}
							className="w-full border p-2 mb-2 rounded"
						/>

						<button
							onClick={() => removeExperience(index)}
							className="text-red-500 hover:text-red-700 text-sm"
						>
							Remove
						</button>
					</div>
				))}
			</div>

			<div className="mt-4">
				<button
					onClick={addExperience}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
				>
					Add Experience
				</button>
			</div>
		</div>
	);
}

export default Experience;
