# Deployment checklist

1. Deploy this directory as a Node.js service over HTTPS (Node 20+). With a container host, build using this Dockerfile.
2. Configure environment variables from `.env.example` in the hosting provider's secret/configuration panel.
3. Provide Google service-account credentials through the provider's secret manager or Application Default Credentials. Never upload the JSON key to GitHub.
4. Set `PORTAL_ORIGINS` to the exact origin where the static portal is served. Set `GOOGLE_CLIENT_ID` to the same web OAuth client as `portale/config.js`.
5. Share the private Drive materials folder and the portal configuration JSON file with the service account as Editor.
6. Fill explicit `TEACHER_EMAILS` and `STUDENT_EMAILS` lists. Do not infer the teacher role from the domain.
7. Set `portale/config.js` `apiBaseUrl` to the deployed HTTPS base URL.
8. Test `/health`, then sign in with a teacher test account, a student test account, an unauthorized account, and an account outside the Workspace domain.
9. Verify that students cannot list or download future-lesson files and cannot call the teacher-only lesson publication endpoint.

Do not announce the portal as active until these tests pass. GitHub Pages only serves the frontend; it does not execute this API or protect Drive files by itself.