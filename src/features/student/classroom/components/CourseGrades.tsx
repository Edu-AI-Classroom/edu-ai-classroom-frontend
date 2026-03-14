import { BarChart3 } from 'lucide-react';

const CourseGrades = () => {
	return (
		<div className="flex items-center justify-center h-64 text-muted-foreground">
			<div className="text-center">
				<BarChart3 className="w-12 h-12 mx-auto mb-4 text-teachify-purple" />
				<p className="text-lg font-medium">Gradebook coming soon!</p>
				<p className="text-sm mt-1">We're building a detailed grade view for each subject.</p>
			</div>
		</div>
	);
};

export default CourseGrades;
