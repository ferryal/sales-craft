export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

export function getInitials(name) {
    return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}
