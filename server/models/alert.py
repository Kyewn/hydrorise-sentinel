import datetime


class Alert:
    def __init__(self, doc_id, dmz_doc_id, dmz_id, nrr, description, status, timestamp):
        self.doc_id = doc_id
        self.dmz_doc_id = dmz_doc_id
        self.dmz_id = dmz_id
        self.nrr = nrr
        self.description = description
        self.status = status
        self.timestamp = timestamp

    def __str__(self):
        return f"""
            'doc_id': {self.doc_id},
            'dmz_doc_id': {self.dmz_doc_id},
            'dmz_id': {self.dmz_id},
            'nrr': {self.nrr},
            'description': {self.description},
            'status': {self.status},
            'timestamp': {self.timestamp}
        """
    
    def convertToFirebaseType(data):
        if ("timestamp" in data.keys()):
            data["timestamp"] = datetime.datetime.strptime(data["timestamp"] , "%Y-%m-%dT%H:%M:%S.%fZ")
        return data

    def serialize(self):
        return {
            'doc_id': self.doc_id,
            'dmz_doc_id': self.dmz_doc_id,
            'dmz_id': self.dmz_id,
            'nrr': self.nrr,
            'description': self.description,
            'status': self.status,
            'timestamp': self.timestamp.isoformat()
        }
    
    @classmethod
    def deserialize(cls, doc):
        return cls(
            doc.id,
            doc.get('dmz_doc_id'),
            doc.get('dmz_id'),
            doc.get('nrr'),
            doc.get('description'),
            doc.get('status'),
            doc.get('timestamp')
        )
