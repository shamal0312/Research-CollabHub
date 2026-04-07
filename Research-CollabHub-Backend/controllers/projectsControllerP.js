package com.smartcampus.projects.controller;

import java.util.ArrayList;
import java.util.List;

public class ProjectController {

    private final List<String> projects = new ArrayList<>();

    public ProjectController() {
        seedProjects();
    }

    private void seedProjects() {
        projects.add("Library Management System");
        projects.add("Smart Parking App");
        projects.add("Student Help Desk");
        projects.add("Campus Event Manager");
        projects.add("Research Collaboration Portal");
    }

    public void createProject(String projectName) {
        if (projectName == null || projectName.isEmpty()) {
            System.out.println("Invalid project name");
            return;
        }

        projects.add(projectName);
        System.out.println("Project created: " + projectName);
    }

    public void updateProject(int index, String newName) {
        if (index < 0 || index >= projects.size()) {
            System.out.println("Project not found");
            return;
        }

        projects.set(index, newName);
        System.out.println("Project updated");
    }

    public void deleteProject(int index) {
        if (index < 0 || index >= projects.size()) {
            System.out.println("Project not found");
            return;
        }

        projects.remove(index);
        System.out.println("Project deleted");
    }

    public void getAllProjects() {
        if (projects.isEmpty()) {
            System.out.println("No projects available");
            return;
        }

        for (int i = 0; i < projects.size(); i++) {
            System.out.println((i + 1) + ". " + projects.get(i));
        }
    }

    public void searchProject(String keyword) {
        boolean found = false;

        for (String project : projects) {
            if (project.toLowerCase().contains(keyword.toLowerCase())) {
                System.out.println(project);
                found = true;
            }
        }

        if (!found) {
            System.out.println("No matching projects");
        }
    }

    public int getProjectCount() {
        return projects.size();
    }

    public static void main(String[] args) {
        ProjectController controller = new ProjectController();

        controller.getAllProjects();
        controller.createProject("Fix Mate Service App");
        controller.updateProject(0, "Advanced Library System");
        controller.searchProject("Smart");
        controller.deleteProject(2);

        System.out.println("Total Projects: " + controller.getProjectCount());
    }

    export const acceptProjectRequest = async (req, res) => {
  res.status(200).json({
    message: "Request accepted successfully"
  });
};

export const rejectProjectRequest = async (req, res) => {
  res.status(200).json({
    message: "Request rejected successfully"
  });
};
}