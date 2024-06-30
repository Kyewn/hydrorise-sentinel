class Hydraulic:
    def __init__(self, doc_id, dmz_id, dmz_name, dt, pressure_tp, pressure_azp, pressure_prv_upstream, pressure_prv_downstream,
                 pressure_prv_upstream_2, pressure_prv_downstream_2, pressure_prv_upstream_3, pressure_prv_downstream_3,
                 flow):
        self.doc_id = doc_id
        self.dmz_id = dmz_id
        self.dmz_name = dmz_name
        self.dt = dt
        self.pressure_tp = pressure_tp
        self.pressure_azp = pressure_azp
        self.pressure_prv_upstream = pressure_prv_upstream
        self.pressure_prv_downstream = pressure_prv_downstream
        self.pressure_prv_upstream_2 = pressure_prv_upstream_2
        self.pressure_prv_downstream_2 = pressure_prv_downstream_2
        self.pressure_prv_upstream_3 = pressure_prv_upstream_3
        self.pressure_prv_downstream_3 = pressure_prv_downstream_3
        self.flow = flow

    def __str__(self):
        return f"""
            'doc_id': {self.doc_id},
            'dmz_id': {self.dmz_id},
            'dmz_name': {self.dmz_name},
            'dt': {self.dt},
            'pressure_tp': {self.pressure_tp},
            'pressure_azp': {self.pressure_azp},
            'pressure_prv_upstream': {self.pressure_prv_upstream},
            'pressure_prv_downstream': {self.pressure_prv_downstream},
            'pressure_prv_upstream_2': {self.pressure_prv_upstream_2},
            'pressure_prv_downstream_2': {self.pressure_prv_downstream_2},
            'pressure_prv_upstream_3': {self.pressure_prv_upstream_3},
            'pressure_prv_downstream_3': {self.pressure_prv_downstream_3},
            'flow': {self.flow}
        """
    
    def serialize(self):
        return {
            'doc_id': self.doc_id,
            'dmz_id': self.dmz_id,
            'dmz_name': self.dmz_name,
            'dt': self.dt,
            'pressure_tp': self.pressure_tp,
            'pressure_azp': self.pressure_azp,
            'pressure_prv_upstream': self.pressure_prv_upstream,
            'pressure_prv_downstream': self.pressure_prv_downstream,
            'pressure_prv_upstream_2': self.pressure_prv_upstream_2,
            'pressure_prv_downstream_2': self.pressure_prv_downstream_2,
            'pressure_prv_upstream_3': self.pressure_prv_upstream_3,
            'pressure_prv_downstream_3': self.pressure_prv_downstream_3,
            'flow': self.flow
        }
    
    @classmethod
    def deserialize(cls, doc):
        return cls(
            doc.id,
            doc.get('dmz_id'),
            doc.get('dmz_name'),
            doc.get('dt'),
            doc.get('pressure_tp'),
            doc.get('pressure_azp'),
            doc.get('pressure_prv_upstream'),
            doc.get('pressure_prv_downstream'),
            doc.get('pressure_prv_upstream_2'),
            doc.get('pressure_prv_downstream_2'),
            doc.get('pressure_prv_upstream_3'),
            doc.get('pressure_prv_downstream_3'),
            doc.get('flow')
        )
