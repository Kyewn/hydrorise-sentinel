class Region:
    def __init__(self, doc_id, name, latest_nrr, geometry):
        self.doc_id = doc_id
        self.name = name
        self.latest_nrr = latest_nrr
        self.geometry = geometry

    def __str__(self):
        return f"""
            'doc_id': {self.doc_id},
            'name': {self.name},
            'latest_nrr': {self.latest_nrr},
            'geometry': {self.geometry}
        """
    
    def serialize(self):
        return {
            'doc_id': self.doc_id,
            'name': self.name,
            'latest_nrr': self.latest_nrr,
            'geometry': self.geometry
        }
    
    @classmethod
    def deserialize(cls, doc):
        return cls(
            doc.id,
            doc.get('name'),
            doc.get('latest_nrr'),
            doc.get('geometry')
        )
