// Function to scroll to previous section
function scrollToPreviousSection(currentSection) {
    // Define the section navigation flow
    const sectionFlow = {
        'video': 'hero',
        'about': 'video',
        'smoke': 'about'
    };
    
    const previousSection = sectionFlow[currentSection];
    
    if (previousSection && window.sectionLoader) {
        window.sectionLoader.loadSection(previousSection);
    }
}