#Upload Course to Canvas

This tool was built in the early days of the D2L to Canvas Conversion process. It was written before the full tool was designed, and *is a standalone tool*. It was not designed to be part of the full conversion tool.
It was broken into the Upload-Course and Create-Course repositories for the conversion tool.

This repo contains 2 different modules: createCourse and uploadCourse
createCourse will automatically call UploadCourse, however uploadCourse can be ran independently

delete.js & putRequest.js are not part of this tool, but were used as a sandbox to practice the Canvas API


```
uploadCourse(filename, courseId)
createCourse(fileName, courseSettings)
```