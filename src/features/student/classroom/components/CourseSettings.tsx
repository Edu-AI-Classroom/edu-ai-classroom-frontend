import { Settings } from 'lucide-react';

const CourseSettings = () => {
	return (
		<div className="flex items-center justify-center h-64 text-muted-foreground">
			<div className="text-center">
				<Settings className="w-12 h-12 mx-auto mb-4 text-teachify-purple" />
				<p className="text-lg font-medium">Course Settings</p>
				<p className="text-sm mt-1">Manage notifications and display preferences.</p>
			</div>
		</div>
	);
};

export default CourseSettings;
