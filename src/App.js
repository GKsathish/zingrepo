import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Pagination,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import ReactLoading from "react-loading";
import "./App.css";

const App = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [data, setData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 100;
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);

  // Fetch data function
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://13.234.96.218:1234/zing/getdatawithpage?page=${page}`
      );
      setData(response.data.data);
      setTotalItems(response.data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      [{ align: [] }], // Alignment options
      ["clean"], // Remove formatting
    ],
  };
  useEffect(() => {
    fetchData(currentPage); // Fetch data when the component mounts or page changes
  }, [currentPage]);

  const handlesub = () => {
    setShowModal1(true);
  };

  // const handleRowClick = (item) => {
  //   setSelectedData(item);
  //   setShowAlert(true);
  // };

  const handleEdit = (item) => {
    setSelectedData(item);
    setShowEditModal(true);
  };

  const onImageChangee = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const onImageChangee1 = (e) => {
    setSelectedImage1(e.target.files[0]);
  };

  // add submit
  const handleaddSave = async (e) => {
    e.preventDefault();
    // const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:MM:SS'
    let ctype = "";
    if (
      selectedData.type_of_Content == "music" ||
      selectedData.type_of_Content == "Music" ||
      selectedData.type_of_Content == "MUSIC" ||
      selectedData.type_of_Content == "MUSICD"
    ) {
      ctype = "MUSICD";
    } else {
      ctype = "YOUTUBE";
    }
    const missingFields = {
      album_name: "",
      url: selectedData.url || "",
      cp_url: selectedData.cp_url || "",
      text: null,
      metadata: selectedData.metadata || "",
      cpid: 10,
      cpname: null,
      label: selectedData.label || "",
      validity: selectedData.validity || null,
      cert: selectedData.cert || "U",
      ctype: ctype,
      format: null,
      status: "approved",
      cdt: "",
      mdt: "",
      cuser: "Admin",
      muser: "Admin",
      starcast: selectedData.starcast || "",
      director: selectedData.director || "",
      genre: selectedData.genre || "",
      genre_new: "",
      movie_name: "",
      language: selectedData.language || "",
      thumb: null,
      producers: null,
      music_director: selectedData.music_director || "",
      singer: selectedData.singer || "",
      duration: selectedData.duration || "N/A",
      rating: selectedData.rating || "4",
      released: selectedData.released || "N/A",
      movie_review: "",
      trurl: selectedData.trurl || "",
      group_type: selectedData.group_type || "",
      app_name: "0",
      fav: "",
      xxhdpi: "",
      xxxhdpi: "",
      cp_url_old: "",
      portrait: "",
      thumb_URL: "",
      cp_name: "Bee innovations",
      cstatus: "Active",
    };

    // Merge the missing fields into selectedData object
    const fullData = { ...selectedData, ...missingFields };
    console.log(selectedData);
    const formData1 = new FormData();
    formData1.append("data", JSON.stringify(fullData));

    formData1.append("image", selectedImage1);
    console.log(formData1);

    try {
      if (selectedData) {
        const response1 = await axios.post(
          "http://13.234.96.218:1234/zing/add",
          formData1
        );
        setData(response1.data);
        setShowModal1(false);
        setSelectedData(null);
        alert("Added Success");

        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setShowEditModal(false);
      setSelectedData(null);
    }
  };
  //  edit submit
  const handleeditSave = async () => {
    console.log(selectedData, selectedImage);

    try {
      if (selectedData) {
        const formData = new FormData();
        if (selectedImage) {
          formData.append("image", selectedImage);
        }
        formData.append("data", JSON.stringify(selectedData));

        console.log(formData);
        // Send the FormData with Axios
        const response = await axios.post(
          `http://13.234.96.218:1234/zing/update/${parseInt(selectedData.id)}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setData(response.data);

        setShowEditModal(false);
        setSelectedData(null);
        setSelectedImage(null);
        alert("update Success");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setShowEditModal(false);
      setSelectedData(null);
      setSelectedImage(null);
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
    setSelectedData(null);
    window.location.reload();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const pageRange = 5; // Number of pages to display at a time

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  // Function to get the visible range of pages based on the current page
  const getVisiblePages = () => {
    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);
    return [...Array(endPage - startPage + 1).keys()].map((i) => startPage + i);
  };
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ctype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm)
  );
  const [sortConfig, setSortConfig] = useState({
    key: "id", // Default sorting by Id
    direction: "desc", // Default sorting in ascending order
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container-fluid">
      <header className="mb-4">
        <Row className="bg-dark">
          <Col xs={4} className="d-flex align-items-center text-info p-1">
            <img src="cmsbanner.webp" alt="Logo" className="img-fluid" />
          </Col>
          <Col xs={4} className="text-center"></Col>
          <Col
            xs={4}
            className="d-flex align-items-center justify-content-end text-info"
          >
            <h2 style={{ color: "#0090CF" }}>Content Repository</h2>
          </Col>
        </Row>
      </header>

      {showAlert && (
        <Alert variant="warning">Please select a row to edit.</Alert>
      )}

      <Row className="mb-4 mx-5">
        <Col>
          <div className="d-flex ">
            <Button
              variant="btn btn-outline-primary"
              onClick={handlesub}
              className="m-1"
            >
              <span className="d-flex justify-content-between align-items-center">
                <small className="d-flex align-items-center  fw-bold fs-6 px-1">
                  {" "}
                  <i className="fa-solid fa-plus mx-2 fs-6 fw-bold"></i>Add{" "}
                </small>
              </span>
            </Button>
          </div>
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-75 m-1  w-md-100"
          />
        </Col>
      </Row>

      <Row>
        {loading ? (
          <div className="d-flex  flex-column justify-content-center align-items-center  m-5 p-5 ">
            <ReactLoading
              type="spin"
              className="mx-5 info"
              color="#0090CF"
              height={"4%"}
              width={"4%"}
            />

            <h1 className="m-5 p-5 fw-bold " style={{ color: "#0090CF" }}>
              loading{" "}
            </h1>
          </div>
        ) : (
          <>
            <Col>
              <div style={{ height: "75vh", overflowY: "auto" }} className="card m-1">
                <Table  bordered hover>
                  <thead className="table-header">
                    <tr>
                      <th>Action</th>
                      <th onClick={() => handleSort("id")}>
                        Id{" "}
                        {sortConfig.key === "id" &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("name")}>
                        Name{" "}
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("description")}>
                        Description{" "}
                        {sortConfig.key === "description" &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("url")}>
                        URL{" "}
                        {sortConfig.key === "url" &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("ctype")}>
                        Type{" "}
                        {sortConfig.key === "ctype" &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("cp_url")}>
                        CP_URL{" "}
                        {sortConfig.key === "cp_url" &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th onClick={() => handleSort("cuser")}>
                        Content Provider{" "}
                        {sortConfig.key === "cuser" &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                      <th>Approve</th>
                      <th>Reject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item) => (
                      <tr key={item.id}
                      style={{
                        backgroundColor: selectedData?.id === item.id ? "#000000" : "transparent"
                      }}
                      >
                        <td>
                          <Button
                            variant="outline-info"
                            onClick={(e) => {
                              handleEdit(item); 
                            }}

                            size="sm"
                          >
                           <span className="d-flex justify-content-between align-items-center">
                <small className="d-flex align-items-center fs-6 fw-bold px-1">
                  {" "}
                  <i class="fa-regular fa-pen-to-square mx-2 fs-6 fw-bold"></i>
                  Edit
                </small>
              </span>
                          </Button>
                        </td>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.url || "N/A"}</td>
                        <td>{item.ctype}</td>
                        <td>{item.cp_url || "N/A"}</td>
                        <td>{item.cuser || "N/A"}</td>
                        <td>
                          {item.status === "Approved" ||
                          item.status === "approved" ||
                          item.status === "ACTIVE"
                            ? item.status
                            : "N/A"}
                        </td>
                        <td>
                          {item.status !== "Approved" ||
                          item.status !== "approved" ||
                          item.status !== "ACTIVE"
                            ? "N/A"
                            : item.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-center m-4">
                <Pagination>
                  {/* First page and Previous page buttons */}
                  <Pagination.First
                    onClick={() => handlePaginationChange(1)}
                    disabled={currentPage === 1}
                    style={{ height: "5rem", fontSize: "5rem" }}
                  />
                  <Pagination.Prev
                    onClick={() => handlePaginationChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ height: "5rem", fontSize: "5rem" }}
                  />

                  {/* Page numbers */}
                  {getVisiblePages().map((page) => (
                    <Pagination.Item
                      key={page}
                      active={currentPage === page}
                      onClick={() => handlePaginationChange(page)}
                      style={{ height: "5rem", fontSize: "5rem" }}
                    >
                      {page}
                    </Pagination.Item>
                  ))}

                  {/* Next page and Last page buttons */}
                  <Pagination.Next
                    onClick={() => handlePaginationChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ height: "5rem", fontSize: "5rem" }}
                  />
                  <Pagination.Last
                    onClick={() => handlePaginationChange(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{ height: "5rem", fontSize: "5rem" }}
                  />
                </Pagination>
              </div>
            </Col>
          </>
        )}
      </Row>
      <Row>
        <Col>
          {selectedData && (
            <div className=" shadow p-4  d-flex   justify-content-even">
              <div>
                <h4>Selected Row Details:</h4>

                <p>
                  <strong>ID:</strong> {selectedData.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedData.name}
                </p>
                <p>
                  <strong>Description:</strong> {selectedData.description}
                </p>
                <p>
                  <strong>URL:</strong> {selectedData.url}
                </p>
                <p>
                  <strong>Type:</strong> {selectedData.ctype}
                </p>
                <p>
                  <strong>CP_URL:</strong> {selectedData.cp_url}
                </p>
                <p>
                  <strong>Content Provider:</strong>{" "}
                  {selectedData.content_provider}
                </p>
                <p>
                  <strong>Approve:</strong> {selectedData.approve}
                </p>
              </div>
              <center className="m-5 w-25">
                <img
                  src={`http://13.234.96.218/previewthumbnail.php?c_id=${selectedData.id}&ctype=${selectedData.ctype}`}
                  alt="img"
                  className="img-thumbnail"
                />
              </center>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mt-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, name: e.target.value })
                }
                defaultValue={selectedData?.name}
              />
            </Form.Group>
            <Form.Group controlId="formMetadata" className="mt-2">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="metadata"
                defaultValue={selectedData?.metadata}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, metadata: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLabel" className="mt-2">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                name="label"
                onChange={(value) =>
                  setSelectedData({ ...selectedData, label: value })
                }
                defaultValue={selectedData?.label}
              />
            </Form.Group>

            <Form.Group controlId="formStarcast" className="mt-2">
              <Form.Label>Star cast</Form.Label>
              <Form.Control
                type="text"
                name="starcast"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, starcast: e.target.value })
                }
                defaultValue={selectedData?.starcast}
              />
            </Form.Group>
            <Form.Group controlId="formDirector" className="mt-2">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, director: e.target.value })
                }
                defaultValue={selectedData?.director}
              />
            </Form.Group>

            <Form.Group controlId="formTypeOfContent" className="mt-2">
              <Form.Label>Type of Content</Form.Label>
              <Form.Control
                type="text"
                name="ctype"
                defaultValue={selectedData?.ctype}
                onChange={(e) =>
                  setSelectedData({
                    ...selectedData,
                    ctype: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formGenre" className="mt-2">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedData?.genre}
                name="genre"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, genre: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formReleased" className="mt-2">
              <Form.Label>Released Year</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedData?.released}
                name="released"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, released: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formMusicDirector" className="mt-2">
              <Form.Label>Music Director</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedData?.music_director}
                name="music_director"
                onChange={(e) =>
                  setSelectedData({
                    ...selectedData,
                    music_director: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formSinger" className="mt-2">
              <Form.Label>Singer</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedData?.singer}
                name="singer"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, singer: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formGroupType" className="mt-2">
              <Form.Label>Group Type</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedData?.group_type}
                name="group_type"
                onChange={(e) =>
                  setSelectedData({
                    ...selectedData,
                    group_type: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* ratbing */}
            <Form.Group controlId="formDuration" className="mt-2">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedData?.rating}
                name="rating"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, rating: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDuration" className="mt-2">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedData?.duration}
                name="duration"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, duration: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formTrurl" className="mt-2">
              <Form.Label>Tailer URL</Form.Label>
              <Form.Control
                type="text"
                name="trurl"
                defaultValue={selectedData?.trurl}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, trurl: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formLanguage" className="mt-2">
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                name="language"
                defaultValue={selectedData?.language}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, language: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formPreviewImage">
              <Form.Label>Preview Image</Form.Label>
              <Form.Control
                type="file"
                name="preview_image"
                accept="image/*"
                onChange={onImageChangee}
              />
            </Form.Group>

            <Form.Group controlId="formValidity" className="mt-2">
              <Form.Label>Valid Till</Form.Label>
              <Form.Control
                type="date"
                defaultValue={selectedData?.validity?.substring(0, 10)}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, validity: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formCert" className="mt-2">
              <Form.Label>Content Certificate</Form.Label>
              <Form.Control
                type="text"
                name="cert"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, cert: e.target.value })
                }
                defaultValue={selectedData?.cert}
              />
            </Form.Group>
            <Form.Group controlId="formCert" className="mt-2">
              <Form.Label>youtube URL</Form.Label>
              <Form.Control
                type="url"
                name="url"
                defaultValue={selectedData?.url}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, url: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCpUrl" className="mt-2">
              <Form.Label>CP URL</Form.Label>
              <Form.Control
                type="url"
                name="cp_url"
                defaultValue={selectedData?.cp_url}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, cp_url: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-2">
              <Form.Label>Description</Form.Label>
              <ReactQuill
                value={selectedData?.description || ""}
                onChange={(content) =>
                  setSelectedData({ ...selectedData, description: content })
                }
                theme="snow"
                modules={modules}
              />
            </Form.Group>
            <Form.Group controlId="formimage" className="mt-2">
              <Form.Label>Preview Image</Form.Label>
              <div>
                <img
                  src={`http://13.234.96.218/previewthumbnail.php?c_id=${selectedData?.id}&ctype=${selectedData?.ctype}`}
                  alt="imgata"
                  className="w-50 h-25"
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleeditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* add modal */}
      <Modal show={showModal1} onHide={() => setShowModal1(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mt-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formMetadata" className="mt-2">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="metadata"
                // defaultValue={selectedData?.metadata}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, metadata: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLabel" className="mt-2">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                name="label"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, label: e.target.value })
                }
                // defaultValue={selectedData?.label}
              />
            </Form.Group>

            <Form.Group controlId="formStarcast" className="mt-2">
              <Form.Label>Star cast</Form.Label>
              <Form.Control
                type="text"
                name="starcast"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, starcast: e.target.value })
                }
                // defaultValue={selectedData?.starcast}
              />
            </Form.Group>
            <Form.Group controlId="formDirector" className="mt-2">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, director: e.target.value })
                }
                // defaultValue={selectedData?.director}
              />
            </Form.Group>

            <Form.Group controlId="formTypeOfContent" className="mt-2">
              <Form.Label>Type of Content</Form.Label>
              <Form.Control
                type="text"
                name="type_of_Content"
                // defaultValue={selectedData?.ctype}
                onChange={(e) =>
                  setSelectedData({
                    ...selectedData,
                    type_of_Content: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formGenre" className="mt-2">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                // defaultValue={selectedData?.genre}
                name="genre"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, genre: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formReleased" className="mt-2">
              <Form.Label>Released Year</Form.Label>
              <Form.Control
                type="text"
                // defaultValue={selectedData?.released}
                name="released"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, released: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formMusicDirector" className="mt-2">
              <Form.Label>Music Director</Form.Label>
              <Form.Control
                type="text"
                // defaultValue={selectedData?.music_director}
                name="music_director"
                onChange={(e) =>
                  setSelectedData({
                    ...selectedData,
                    music_director: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formSinger" className="mt-2">
              <Form.Label>Singer</Form.Label>
              <Form.Control
                type="text"
                // defaultValue={selectedData?.singer}
                name="singer"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, singer: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formGroupType" className="mt-2">
              <Form.Label>Group Type</Form.Label>
              <Form.Control
                type="text"
                // defaultValue={selectedData?.group_type}
                name="group_type"
                onChange={(e) =>
                  setSelectedData({
                    ...selectedData,
                    group_type: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDuration" className="mt-2">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                // defaultValue={selectedData?.rating}
                name="rating"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, rating: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDuration" className="mt-2">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                // defaultValue={selectedData?.duration}
                name="duration"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, duration: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formTrurl" className="mt-2">
              <Form.Label>Tailer URL</Form.Label>
              <Form.Control
                type="text"
                name="trurl"
                // defaultValue={selectedData?.trurl}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, trurl: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formLanguage" className="mt-2">
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                name="language"
                // defaultValue={selectedData?.language}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, language: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formPreviewImage">
              <Form.Label>Preview Image</Form.Label>
              <Form.Control
                type="file"
                name="preview_image"
                accept="image/*"
                onChange={onImageChangee1}
              />
            </Form.Group>

            <Form.Group controlId="formValidity" className="mt-2">
              <Form.Label>Valid Till</Form.Label>
              <Form.Control
                type="date"
                // defaultValue={selectedData?.validity?.substring(0, 10)}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, validity: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formCert" className="mt-2">
              <Form.Label>Content Certificate</Form.Label>
              <Form.Control
                type="text"
                name="cert"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, cert: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCert" className="mt-2">
              <Form.Label>youtube URL</Form.Label>
              <Form.Control
                type="url"
                name="url"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, url: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCpUrl" className="mt-2">
              <Form.Label>CP URL</Form.Label>
              <Form.Control
                type="url"
                name="cp_url"
                // defaultValue={selectedData?.cp_url}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, cp_url: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-2">
              <Form.Label>Description</Form.Label>
              <ReactQuill
                value={selectedData?.description || ""}
                onChange={(content) =>
                  setSelectedData({ ...selectedData, description: content })
                }
                theme="snow"
                modules={modules}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleaddSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
