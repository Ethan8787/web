const ProjectCard = ({ project }) => {
    return (
        <div className="project-card">
            <div className="project-info">
                <h3>{project.name}</h3>
                <span className="tag">{project.tag}</span>
            </div>
            <p className="description">{project.description}</p>
            {project.isPrivate ? (
                <span className="project-link private-link">Private Repository</span>
            ) : (
                <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                    View Project
                </a>
            )}
        </div>
    );
};

const ProjectGrid = ({ projects }) => {
    return (
        <div className="project-grid">
            {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
            ))}
        </div>
    );
};