import { Project } from '../types/Project'

interface DepartmentsTableProps {
  projects: Project[]
}

const DepartmentsTable = ({ projects }: DepartmentsTableProps) => {
  const grouped = projects.reduce((acc, project) => {
    if (!acc[project.department_name]) acc[project.department_name] = []
    acc[project.department_name].push(project)
    return acc
  }, {} as Record<string, Project[]>)

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dept, projs]) => (
        <div key={dept} className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-primary mb-3">{dept}</h3>
          <ul className="space-y-1">
            {projs.map((p) => (
              <li key={p.id} className="text-sm text-gray-700">
                • {p.title} — <span className="text-gray-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DepartmentsTable
