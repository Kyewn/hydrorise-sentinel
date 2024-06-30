class DMZ:
    def __init__(self, doc_id, id, name, area_name, region_id, strata, classification, domestic_connections,
                 non_domestic_connections, total_connections, total_distribution_mains_length, shape_area,
                 shape_length, geometry, latest_nrr):
        self.doc_id = doc_id
        self.id = id
        self.name = name
        self.area_name = area_name
        self.region_id = region_id
        self.strata = strata
        self.classification = classification
        self.domestic_connections = domestic_connections
        self.non_domestic_connections = non_domestic_connections
        self.total_connections = total_connections
        self.total_distribution_mains_length = total_distribution_mains_length
        self.shape_area = shape_area
        self.shape_length = shape_length
        self.geometry = geometry
        self.latest_nrr = latest_nrr

    def __str__(self):
        return f"""
            'doc_id': {self.doc_id},
            'id': {self.id},
            'name': {self.name},
            'area_name': {self.area_name},
            'region_id': {self.region_id},
            'strata': {self.strata},
            'classification': {self.classification},
            'domestic_connections': {self.domestic_connections},
            'non_domestic_connections': {self.non_domestic_connections},
            'total_connections': {self.total_connections},
            'total_distribution_mains_length': {self.total_distribution_mains_length},
            'shape_area': {self.shape_area},
            'shape_length': {self.shape_length},
            'geometry': {self.geometry},
            'latest_nrr': {self.latest_nrr}
        """
    
    def serialize(self):
        return {
            'doc_id': self.doc_id,
            'id': self.id,
            'name': self.name,
            'area_name': self.area_name,
            'region_id': self.region_id,
            'strata': self.strata,
            'classification': self.classification,
            'domestic_connections': self.domestic_connections,
            'non_domestic_connections': self.non_domestic_connections,
            'total_connections': self.total_connections,
            'total_distribution_mains_length': self.total_distribution_mains_length,
            'shape_area': self.shape_area,
            'shape_length': self.shape_length,
            'geometry': self.geometry,
            'latest_nrr': self.latest_nrr
        }
    
    @classmethod
    def deserialize(cls, doc):
        return cls(
            doc.id,
            doc.get('id'),
            doc.get('name'),
            doc.get('area_name'),
            doc.get('region_id'),
            doc.get('strata'),
            doc.get('classification'),
            doc.get('domestic_connections'),
            doc.get('non_domestic_connections'),
            doc.get('total_connections'),
            doc.get('total_distribution_mains_length'),
            doc.get('shape_area'),
            doc.get('shape_length'),
            doc.get('geometry'),
            doc.get('latest_nrr')
        )
