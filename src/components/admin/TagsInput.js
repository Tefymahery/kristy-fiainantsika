import { TextField, Chip, Box } from '@mui/material';

const TagsInput = ({ tags, setTags }) => {
  // Gérer l'ajout des tags avec "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.target.value = ''; // Réinitialiser le champ après ajout
    }
  };

  // Gérer la suppression d'un tag
  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onDelete={() => handleDelete(tag)}
          color="primary"
          variant="outlined"
        />
      ))}
      <TextField
        label="Ajouter un tag"
        onKeyDown={handleKeyDown}
        variant="outlined"
        sx={{ flex: 1 }}
        placeholder="Appuyez sur Entrée pour ajouter un tag"
      />
    </Box>
  );
};

export default TagsInput;
