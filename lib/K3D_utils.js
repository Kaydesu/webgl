var parseFilename = function (file_name) {
    var dot_position, slash_position, path, root, extension;

    // Get the extension
    dot_position = file_name.lastIndexOf('.');
    if (dot_position > 0) {
        extension = file_name.substr(dot_position + 1);
        root = file_name.substr(0, dot_position);
    } else {
        extension = "";
        root = file_name;
    }

    // Get the path
    slash_position = root.lastIndexOf('/');
    if (slash_position > 0) {
        path = root.substr(0, slash_position + 1);
        root = root.substr(slash_position + 1);
    } else {
        path = "";
    }

    return [path, root, extension];
}