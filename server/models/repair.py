import datetime
class Repair:
    def __init__(self, id, region, case_number, action_by, status, dmz_id, child_case_reason, dt_opened, dt_closed,
                 dt_wo_creation, location, subcategory, subject, description, quick_comment, declined_reason,
                 other_declined_reasons, cancelled_reason, other_cancelled_reasons, actual_problem, case_resolution):
        self.id = id
        self.region = region
        self.case_number = case_number
        self.action_by = action_by
        self.status = status
        self.dmz_id = dmz_id
        self.child_case_reason = child_case_reason
        self.dt_opened = dt_opened
        self.dt_closed = dt_closed
        self.dt_wo_creation = dt_wo_creation
        self.location = location
        self.subcategory = subcategory
        self.subject = subject
        self.description = description
        self.quick_comment = quick_comment
        self.declined_reason = declined_reason
        self.other_declined_reasons = other_declined_reasons
        self.cancelled_reason = cancelled_reason
        self.other_cancelled_reasons = other_cancelled_reasons
        self.actual_problem = actual_problem
        self.case_resolution = case_resolution

    def __str__(self):
        return f"""
            "id": {self.id},
            "region": {self.region},
            "case_number": {self.case_number},
            "action_by": {self.action_by},
            "status": {self.status},
            "dmz_id": {self.dmz_id},
            "child_case_reason": {self.child_case_reason},
            "dt_opened": {self.dt_opened},
            "dt_closed": {self.dt_closed},
            "dt_wo_creation": {self.dt_wo_creation},
            "location": {self.location},
            "subcategory": {self.subcategory},
            "subject": {self.subject},
            "description": {self.description},
            "quick_comment": {self.quick_comment},
            "declined_reason": {self.declined_reason},
            "other_declined_reasons": {self.other_declined_reasons},
            "cancelled_reason": {self.cancelled_reason},
            "other_cancelled_reasons": {self.other_cancelled_reasons},
            "actual_problem": {self.actual_problem},
            "case_resolution": {self.case_resolution}
        """
    
    def serialize(self):
        return  {
            "id": self.id,
            "region": self.region,
            "case_number": self.case_number,
            "action_by": self.action_by,
            "status": self.status,
            "dmz_id": self.dmz_id,
            "child_case_reason": self.child_case_reason,
            "dt_opened": self.dt_opened.isoformat(),
            "dt_closed": self.dt_closed.isoformat(),
            "dt_wo_creation": self.dt_wo_creation.isoformat(),
            "location": self.location,
            "subcategory": self.subcategory,
            "subject": self.subject,
            "description": self.description,
            "quick_comment": self.quick_comment,
            "declined_reason": self.declined_reason,
            "other_declined_reasons": self.other_declined_reasons,
            "cancelled_reason": self.cancelled_reason,
            "other_cancelled_reasons": self.other_cancelled_reasons,
            "actual_problem": self.actual_problem,
            "case_resolution": self.case_resolution
        }
    
    def convertToFirebaseType(data):
        if ("dt_closed" in data.keys()):
            data["dt_closed"] = datetime.datetime.strptime(data["dt_closed"] , "%Y-%m-%dT%H:%M:%S.%fZ")
        if ("dt_opened" in data.keys()):
            data["dt_opened"] =  datetime.datetime.strptime(data["dt_opened"], "%Y-%m-%dT%H:%M:%S.%fZ")
        if ("dt_wo_creation" in data.keys()): 
            data["dt_wo_creation"] =  datetime.datetime.strptime(data["dt_wo_creation"], "%Y-%m-%dT%H:%M:%S.%fZ")
        return data
    
    @classmethod
    def deserialize(cls, object):
        # Some fields may be missing on firebase, use dict to coalesce to default empty value
        objectDict = object.to_dict()
        return cls(
            object.id,
            objectDict.get("region"),
            objectDict.get("case_number"),
            objectDict.get("action_by"),
            objectDict.get("status"),
            objectDict.get("dmz_id"),
            objectDict.get("child_case_reason", ""),
            objectDict.get("dt_opened", ""),
            objectDict.get("dt_closed", ""),
            objectDict.get("dt_wo_creation", ""),
            objectDict.get("location", ""),
            objectDict.get("subcategory", ""),
            objectDict.get("subject", ""),
            objectDict.get("description", ""),
            objectDict.get("quick_comment", ""),
            objectDict.get("declined_reason", ""),
            objectDict.get("other_declined_reasons", ""),
            objectDict.get("cancelled_reason", ""),
            objectDict.get("other_cancelled_reasons", ""),
            objectDict.get("actual_problem", ""),
            objectDict.get("case_resolution", "")
        )
